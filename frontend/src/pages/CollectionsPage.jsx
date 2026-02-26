import { useEffect, useState } from "react";
import { userApi } from "../api/services";
import PropertyCard from "../components/property/PropertyCard";
import Seo from "../components/ui/Seo";

const CollectionsPage = () => {
  const [data, setData] = useState({ favorites: [], recentlyViewed: [] });

  useEffect(() => {
    userApi.collections().then((res) => setData(res.data));
  }, []);

  return (
    <>
      <Seo title="Saved Properties" />
      <section>
        <h1 className="section-title">Favorite Properties</h1>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.favorites.map((item) => <PropertyCard key={item._id} item={item} compact />)}
        </div>
      </section>
      <section className="mt-10">
        <h2 className="section-title">Recently Viewed</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.recentlyViewed.map((item) => <PropertyCard key={item._id} item={item} compact />)}
        </div>
      </section>
    </>
  );
};

export default CollectionsPage;
