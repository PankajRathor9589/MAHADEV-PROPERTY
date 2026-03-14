import { useEffect, useState } from "react";
import { FaHeartBroken } from "react-icons/fa";
import { favoriteApi } from "../api/services";
import PropertyCard from "../components/property/PropertyCard";
import Seo from "../components/ui/Seo";
import { ListingResultsSkeleton } from "../components/ui/Skeletons";

const CollectionsPage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const items = await favoriteApi.list();
        setFavorites(items);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleRemoveFavorite = async (propertyId) => {
    const next = await favoriteApi.remove(propertyId);
    setFavorites(next);
  };

  return (
    <>
      <Seo
        title="Saved Properties"
        description="View and manage your saved properties in one place."
        keywords="saved properties, favorites, real estate wishlist"
      />

      <section className="panel-card overflow-hidden p-0">
        <div className="grid gap-6 p-6 lg:p-8">
          <div>
            <p className="surface-label">Favorites system</p>
            <h1 className="section-heading mt-2 text-4xl">Your saved property shortlist</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Keep promising listings together, revisit them later, and remove them once you have narrowed your search.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8">
        {loading ? (
          <ListingResultsSkeleton count={3} />
        ) : favorites.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {favorites.map((item) => (
              <PropertyCard key={item.id} property={item} onSave={handleRemoveFavorite} favoriteActive />
            ))}
          </div>
        ) : (
          <div className="panel-card p-10 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-500">
              <FaHeartBroken />
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-ink">No saved properties yet</h2>
            <p className="mt-3 text-sm text-slate-600">Tap the heart icon on any listing to save it here for later review.</p>
          </div>
        )}
      </div>
    </>
  );
};

export default CollectionsPage;
