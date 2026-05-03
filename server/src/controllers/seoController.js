import Property from "../models/Property.js";
import { resolveSiteUrl } from "../utils/siteUrl.js";

const escapeXml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

export const getSitemapXml = async (req, res, next) => {
  try {
    const siteUrl = resolveSiteUrl();
    const properties = await Property.find({ approvalStatus: "approved" })
      .select("slug updatedAt createdAt")
      .sort({ updatedAt: -1 })
      .lean();

    const urls = [
      {
        loc: siteUrl,
        lastmod: new Date().toISOString(),
        changefreq: "weekly",
        priority: "1.0"
      },
      {
        loc: `${siteUrl}/properties`,
        lastmod: new Date().toISOString(),
        changefreq: "daily",
        priority: "0.9"
      },
      ...properties.map((property) => ({
        loc: `${siteUrl}/properties/${property.slug || property._id}`,
        lastmod: new Date(property.updatedAt || property.createdAt || Date.now()).toISOString(),
        changefreq: "weekly",
        priority: "0.8"
      }))
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (entry) => `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    return res.status(200).send(xml);
  } catch (error) {
    return next(error);
  }
};
