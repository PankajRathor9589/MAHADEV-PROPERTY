import { useEffect } from "react";

const ensureMetaTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }

  return element;
};

const ensureLinkTag = (selector, attributes) => {
  let element = document.head.querySelector(selector);

  if (!element) {
    element = document.createElement("link");
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    document.head.appendChild(element);
  }

  return element;
};

const updateStructuredData = (structuredData) => {
  const existingScript = document.head.querySelector('script[data-seo="structured-data"]');

  if (!structuredData) {
    existingScript?.remove();
    return;
  }

  const nextScript = existingScript || document.createElement("script");
  nextScript.type = "application/ld+json";
  nextScript.dataset.seo = "structured-data";
  nextScript.textContent = JSON.stringify(structuredData);

  if (!existingScript) {
    document.head.appendChild(nextScript);
  }
};

const Seo = ({
  title,
  description,
  canonical,
  image,
  keywords,
  robots = "index, follow",
  type = "website",
  structuredData
}) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const descriptionTag = ensureMetaTag('meta[name="description"]', { name: "description" });
    descriptionTag.setAttribute("content", description || "");

    const keywordsTag = ensureMetaTag('meta[name="keywords"]', { name: "keywords" });
    keywordsTag.setAttribute("content", keywords || "");

    const robotsTag = ensureMetaTag('meta[name="robots"]', { name: "robots" });
    robotsTag.setAttribute("content", robots);

    const canonicalTag = ensureLinkTag('link[rel="canonical"]', { rel: "canonical" });
    canonicalTag.setAttribute("href", canonical || window.location.href);

    ensureMetaTag('meta[property="og:title"]', { property: "og:title" }).setAttribute("content", title || "");
    ensureMetaTag('meta[property="og:description"]', { property: "og:description" }).setAttribute(
      "content",
      description || ""
    );
    ensureMetaTag('meta[property="og:type"]', { property: "og:type" }).setAttribute("content", type);
    ensureMetaTag('meta[property="og:url"]', { property: "og:url" }).setAttribute(
      "content",
      canonical || window.location.href
    );
    ensureMetaTag('meta[property="og:image"]', { property: "og:image" }).setAttribute("content", image || "");

    ensureMetaTag('meta[name="twitter:card"]', { name: "twitter:card" }).setAttribute(
      "content",
      image ? "summary_large_image" : "summary"
    );
    ensureMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }).setAttribute("content", title || "");
    ensureMetaTag('meta[name="twitter:description"]', { name: "twitter:description" }).setAttribute(
      "content",
      description || ""
    );
    ensureMetaTag('meta[name="twitter:image"]', { name: "twitter:image" }).setAttribute("content", image || "");

    updateStructuredData(structuredData);
  }, [canonical, description, image, keywords, robots, structuredData, title, type]);

  return null;
};

export default Seo;
