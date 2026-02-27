import { Helmet } from "react-helmet-async";

const Seo = ({ title, description, canonical }) => (
  <Helmet>
    <title>{title ? `${title} | Mahadev Property` : "Mahadev Property"}</title>
    <meta name="description" content={description || "Verified Sagar MP property listings by Prashant Rathore. Explore plots, houses, farm land, and commercial properties with local tehsil support."} />
    {canonical && <link rel="canonical" href={canonical} />}
  </Helmet>
);

export default Seo;
