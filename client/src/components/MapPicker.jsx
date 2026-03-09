import { useEffect, useRef } from "react";
import useGoogleMapsScript from "../hooks/useGoogleMapsScript.js";

const defaultCenter = { lat: 28.6139, lng: 77.209 };

const MapPicker = ({ latitude, longitude, onChange }) => {
  const { loaded, error } = useGoogleMapsScript();
  const mapElementRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    if (!loaded || !mapElementRef.current) {
      return;
    }

    const center = {
      lat: Number(latitude) || defaultCenter.lat,
      lng: Number(longitude) || defaultCenter.lng
    };

    mapRef.current = new window.google.maps.Map(mapElementRef.current, {
      center,
      zoom: 14,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false
    });

    markerRef.current = new window.google.maps.Marker({
      map: mapRef.current,
      position: center,
      draggable: true
    });

    mapRef.current.addListener("click", (event) => {
      const newLat = Number(event.latLng.lat().toFixed(6));
      const newLng = Number(event.latLng.lng().toFixed(6));
      markerRef.current.setPosition({ lat: newLat, lng: newLng });
      onChange?.({ latitude: newLat, longitude: newLng });
    });

    markerRef.current.addListener("dragend", (event) => {
      const newLat = Number(event.latLng.lat().toFixed(6));
      const newLng = Number(event.latLng.lng().toFixed(6));
      onChange?.({ latitude: newLat, longitude: newLng });
    });
  }, [loaded, onChange]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) {
      return;
    }

    if (latitude === undefined || longitude === undefined || latitude === "" || longitude === "") {
      return;
    }

    const position = { lat: Number(latitude), lng: Number(longitude) };
    markerRef.current.setPosition(position);
    mapRef.current.panTo(position);
  }, [latitude, longitude]);

  if (error) {
    return (
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
        {error} Add `VITE_GOOGLE_MAPS_API_KEY` to enable pin selection.
      </div>
    );
  }

  return <div ref={mapElementRef} className="h-72 w-full rounded-xl border border-slate-300" />;
};

export default MapPicker;
