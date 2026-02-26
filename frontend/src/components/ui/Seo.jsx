import { Helmet } from "react-helmet-async";

const Seo = ({ title, description, canonical }) => (
  <Helmet>
    <title>{title ? `${title} | Mahadev Property` : "Mahadev Property"}</title>
    <meta name="description" content={description || "Trusted real estate listings for plots, flats, houses and commercial properties."} />
    {canonical && <link rel="canonical" href={canonical} />}
  </Helmet>
);

export default Seo;
