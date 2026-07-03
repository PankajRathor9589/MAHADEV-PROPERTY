import { Heart, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyCard from "../components/PropertyCard.jsx";
import Seo from "../components/Seo.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { COMPANY_INFO } from "../data/siteContent.js";
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
    <>
      <Seo
        title={`Favorites | ${COMPANY_INFO.name}`}
        description={`Saved property shortlist for ${COMPANY_INFO.name}.`}
        canonical={`${COMPANY_INFO.canonicalUrl}/favorites`}
        robots="noindex, nofollow"
      />

      <section className="section-shell pt-8">
        <div className="glass-panel overflow-hidden p-6 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="section-kicker">Wishlist</p>
              <h1 className="section-title mt-3">Your saved property shortlist</h1>
              <p className="mt-4 text-sm leading-8 text-ink-500 sm:text-base">
                Keep serious options in one place, revisit them later, and move faster on calls, WhatsApp, and site visits.
              </p>
            </div>

            <div className="rounded-[28px] border border-[#e8dece] bg-[#fbf8f2] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">Saved Count</p>
              <p className="mt-3 text-4xl font-semibold text-ink-900">{favorites.length}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-shell pt-0">
        {error ? <p className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p> : null}
        {loading ? <p className="text-sm text-ink-500">Loading saved properties...</p> : null}

        {!loading ? (
          favorites.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,21rem),1fr))] gap-5">
              {favorites.map((property) => (
                <div key={property._id} className="space-y-3">
                  <PropertyCard property={property} />
                  <button
                    type="button"
                    onClick={() => handleRemoveFavorite(property)}
                    disabled={favoriteBusyId === property._id}
                    className="btn-ghost w-full"
                  >
                    <Trash2 size={16} />
                    {favoriteBusyId === property._id ? "Removing..." : "Remove from Wishlist"}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-panel surface-grid flex flex-col items-center justify-center gap-4 p-8 text-center sm:p-10">
              <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold-300 bg-[#f7ecd7] text-gold-700">
                <Heart size={28} />
              </span>
              <div>
                <h2 className="text-3xl font-semibold text-ink-900">No saved properties yet</h2>
                <p className="mt-3 text-sm leading-7 text-ink-500 sm:text-base">
                  Browse the live inventory and save the listings you want to revisit later.
                </p>
              </div>
              <Link to="/properties" className="btn-primary">
                Explore Properties
              </Link>
            </div>
          )
        ) : null}
      </section>
    </>
  );
};

export default FavoritesPage;
