const defaultSiteUrl = "https://www.sagar-infra.in";

const normalizeBaseUrl = (value = "") => String(value).trim().replace(/\/$/, "");

const resolveApiBaseUrl = () => {
  const configuredUrl = normalizeBaseUrl(
    process.env.SITEMAP_API_URL || process.env.API_URL || process.env.VITE_API_URL || ""
  );

  if (!configuredUrl) {
    return "";
  }

  return configuredUrl.endsWith("/api") ? configuredUrl : `${configuredUrl}/api`;
};

const buildFallbackSitemap = (siteUrl) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${siteUrl}/properties</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

export default async function handler(req, res) {
  const siteUrl = normalizeBaseUrl(process.env.PUBLIC_SITE_URL || process.env.VITE_SITE_URL || defaultSiteUrl);
  const apiBaseUrl = resolveApiBaseUrl();

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

  if (!apiBaseUrl) {
    return res.status(200).send(buildFallbackSitemap(siteUrl));
  }

  try {
    const response = await fetch(`${apiBaseUrl}/seo/sitemap.xml`);

    if (!response.ok) {
      throw new Error(`Failed to fetch backend sitemap: ${response.status}`);
    }

    const xml = await response.text();
    return res.status(200).send(xml);
  } catch (error) {
    console.error("Falling back to minimal sitemap.", error);
    return res.status(200).send(buildFallbackSitemap(siteUrl));
  }
}
