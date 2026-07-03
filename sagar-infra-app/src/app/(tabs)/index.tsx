import { Link, router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Button, palette, PropertyCard, Screen, SectionTitle, StateBox } from '@/components/ui';
import { fetchProperties } from '@/services/api';
import { Property } from '@/types/api';

const categories = ['Plots', 'Homes', 'Shops', 'Commercial'];

export default function HomeScreen() {
  const [featured, setFeatured] = useState<Property[]>([]);
  const [latest, setLatest] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const loadHome = useCallback(async () => {
    try {
      setLoading(true);
      const [featuredResponse, latestResponse] = await Promise.all([
        fetchProperties({ featured: 'true', limit: 4 }),
        fetchProperties({ limit: 5, sort: 'latest' }),
      ]);
      setFeatured(featuredResponse.data || []);
      setLatest(latestResponse.data || []);
    } catch {
      setFeatured([]);
      setLatest([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  return (
    <Screen>
      <View style={local.hero}>
        <Text style={local.brand}>Sagar Infra</Text>
        <Text style={local.heroTitle}>Find verified plots, homes, shops, and commercial spaces.</Text>
        <Text style={local.heroText}>Premium real-estate guidance for Sagar and nearby growth locations.</Text>
        <Pressable style={local.search} onPress={() => router.push('/properties')}>
          <Text style={local.searchText}>Search city, locality, or property</Text>
        </Pressable>
        <Button onPress={() => router.push('/properties')}>Explore Properties</Button>
      </View>

      <View style={local.categoryGrid}>
        {categories.map((category) => (
          <Link
            key={category}
            href={{ pathname: '/properties', params: { category: category === 'Homes' ? 'House' : category === 'Shops' ? 'Commercial' : category.replace('s', '') } }}
            asChild>
            <Pressable style={local.categoryCard}>
              <Text style={local.categoryTitle}>{category}</Text>
              <Text style={local.categoryText}>Browse live listings</Text>
            </Pressable>
          </Link>
        ))}
      </View>

      <SectionTitle eyebrow="Featured" title="Handpicked properties" />
      {loading ? <StateBox loading title="Loading featured properties" /> : null}
      {!loading && featured.length === 0 ? <StateBox title="No featured properties yet" message="Latest approved listings are shown below." /> : null}
      {featured.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}

      <SectionTitle eyebrow="Latest" title="New on Sagar Infra" />
      {latest.map((property) => (
        <PropertyCard key={property._id} property={property} compact />
      ))}

      <View style={local.cta}>
        <Text style={local.ctaTitle}>Need help choosing?</Text>
        <Text style={local.ctaText}>Share your budget and preferred locality. Sagar Infra can help shortlist practical options.</Text>
        <Button variant="secondary" onPress={() => router.push('/properties')}>
          Start Shortlisting
        </Button>
      </View>
    </Screen>
  );
}

const local = StyleSheet.create({
  hero: {
    backgroundColor: palette.navy,
    borderRadius: 8,
    padding: 22,
    gap: 14,
  },
  brand: {
    color: palette.gold,
    fontSize: 16,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: palette.white,
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900',
  },
  heroText: {
    color: '#D6DEE9',
    fontSize: 15,
    lineHeight: 22,
  },
  search: {
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: palette.white,
    paddingHorizontal: 14,
  },
  searchText: {
    color: palette.muted,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '48.5%',
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    padding: 14,
    gap: 5,
  },
  categoryTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  categoryText: {
    color: palette.muted,
    fontSize: 13,
  },
  cta: {
    backgroundColor: '#FFF8E1',
    borderColor: '#E7D28B',
    borderWidth: 1,
    borderRadius: 8,
    padding: 18,
    gap: 10,
  },
  ctaTitle: {
    color: palette.navy,
    fontSize: 22,
    fontWeight: '900',
  },
  ctaText: {
    color: palette.ink,
    lineHeight: 22,
  },
});
