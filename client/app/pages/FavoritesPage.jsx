import { useEffect, useState } from "react";
import PropertyCard from "../components/PropertyCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchFavorites, removeFavorite } from "../services/api.js";

const FavoritesPage = () => {
  const { refreshUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteBusyId, setFavoriteBusyId] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await fetchFavorites();
      setFavorites(response.data || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemoveFavorite = async (property) => {
    try {
      setFavoriteBusyId(property._id);
      await removeFavorite(property._id);
      await refreshUser();
      setFavorites((current) => current.filter((item) => item._id !== property._id));
    } catch (removeError) {
      setError(removeError.message);
    } finally {
      setFavoriteBusyId("");
    }
  };

  return (
    <div className="space-y-6">
      <section className="card">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-700">Saved homes</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Your Favorites</h1>
        <p className="mt-2 text-sm text-slate-500">
          Revisit the listings you are considering and keep them in one place.
        </p>
      </section>

      {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
      {loading ? <p className="text-sm text-slate-500">Loading favorites...</p> : null}

      {!loading && (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {favorites.length > 0 ? (
            favorites.map((property) => (
              <PropertyCard
                key={property._id}
                property={property}
                isFavorite
                onToggleFavorite={handleRemoveFavorite}
                favoriteBusy={favoriteBusyId === property._id}
                showOwner
              />
            ))
          ) : (
            <div className="card col-span-full text-center text-sm text-slate-500">
              You have not saved any properties yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FavoritesPage;
