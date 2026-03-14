import { Helmet } from "react-helmet-async";
import { BRAND, SITE_URL } from "../../config/site";

const Seo = ({
  title,
  description,
  canonical,
  image,
  keywords,
  type = "website",
  structuredData
}) => {
  const pageTitle = title ? `${title} | ${BRAND.name}` : BRAND.name;
  const metaDescription =
    description ||
    "Verified property listings with saved homes, map search, comparison flows, and responsive agent and admin dashboards.";
  const canonicalUrl = canonical || (typeof window !== "undefined" ? window.location.href : SITE_URL);
  const socialImage = image || `${SITE_URL}/og-image.jpg`;

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={metaDescription} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={socialImage} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={socialImage} />
      <link rel="canonical" href={canonicalUrl} />
      {structuredData && <script type="application/ld+json">{JSON.stringify(structuredData)}</script>}
    </Helmet>
  );
};

export default Seo;
