import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, View } from 'react-native';

import { Button, PropertyCard, Screen, SectionTitle, StateBox } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { fetchFavorites, removeFavorite } from '@/services/api';
import { Property } from '@/types/api';

export default function FavoritesScreen() {
  const { isAuthenticated, refreshUser } = useAuth();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState('');

  const loadFavorites = useCallback(async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setFavorites(await fetchFavorites());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load favorites.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const handleRemove = async (property: Property) => {
    try {
      setBusyId(property._id);
      const nextFavorites = await removeFavorite(property._id);
      setFavorites(nextFavorites);
      await refreshUser();
    } catch (removeError) {
      setError(removeError instanceof Error ? removeError.message : 'Unable to remove favorite.');
    } finally {
      setBusyId('');
    }
  };

  if (!isAuthenticated) {
    return (
      <Screen>
        <SectionTitle eyebrow="Wishlist" title="Saved properties" />
        <StateBox title="Login required" message="Create an account or login to save and revisit your property shortlist." />
        <Button onPress={() => router.push('/login')}>Login</Button>
        <Button variant="ghost" onPress={() => router.push('/register')}>
          Create Account
        </Button>
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionTitle eyebrow="Wishlist" title="Your saved properties" />
      {error ? <StateBox title="Favorites error" message={error} /> : null}
      {loading ? <StateBox loading title="Loading favorites" /> : null}
      {!loading && favorites.length === 0 ? <StateBox title="No saved properties yet" message="Tap save on any property to build your shortlist." /> : null}
      {favorites.map((property) => (
        <PropertyCard
          key={property._id}
          property={property}
          footer={
            <Button variant="danger" disabled={busyId === property._id} onPress={() => handleRemove(property)}>
              {busyId === property._id ? 'Removing...' : 'Remove from Favorites'}
            </Button>
          }
        />
      ))}
      <View style={local.refreshHint}>
        <RefreshControl refreshing={false} onRefresh={loadFavorites} />
        <Text style={local.hint}>Pull-to-refresh is available on the Properties tab. Reopen this tab to refresh favorites.</Text>
      </View>
    </Screen>
  );
}

const local = StyleSheet.create({
  refreshHint: {
    height: 1,
    overflow: 'hidden',
  },
  hint: {
    height: 0,
  },
});
