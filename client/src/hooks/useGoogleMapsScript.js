import { useEffect, useState } from "react";

let scriptLoadingPromise;

const loadGoogleMaps = (apiKey) => {
  if (!apiKey) {
    return Promise.reject(new Error("Google Maps API key is missing."));
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (scriptLoadingPromise) {
    return scriptLoadingPromise;
  }

  scriptLoadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-google-maps="true"]');

    if (existing) {
      existing.addEventListener("load", () => resolve(window.google?.maps));
      existing.addEventListener("error", () => reject(new Error("Failed to load Google Maps.")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMaps = "true";

    script.onload = () => resolve(window.google?.maps);
    script.onerror = () => reject(new Error("Failed to load Google Maps."));

    document.head.appendChild(script);
  });

  return scriptLoadingPromise;
};

const useGoogleMapsScript = () => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [state, setState] = useState({ loaded: false, error: "" });

  useEffect(() => {
    let isMounted = true;

    if (!apiKey) {
      setState({ loaded: false, error: "Google Maps API key not configured." });
      return () => {};
    }

    loadGoogleMaps(apiKey)
      .then(() => {
        if (isMounted) {
          setState({ loaded: true, error: "" });
        }
      })
      .catch((error) => {
        if (isMounted) {
          setState({ loaded: false, error: error.message || "Failed to load Google Maps." });
        }
      });

    return () => {
      isMounted = false;
    };
  }, [apiKey]);

  return state;
};

export default useGoogleMapsScript;
