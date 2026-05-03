const defaultSiteUrl = "https://www.sagar-infra.in";

export const resolveSiteUrl = () =>
  String(process.env.PUBLIC_SITE_URL || process.env.FRONTEND_URL || process.env.CLIENT_URL || defaultSiteUrl)
    .trim()
    .replace(/\/$/, "");
