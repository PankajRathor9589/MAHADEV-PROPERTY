import type { MetadataRoute } from "next";

const siteUrl = "https://www.sagar-infra.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/properties`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.8
    }
  ];
}
