import { useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Field, palette, PropertyCard, SectionTitle, StateBox } from '@/components/ui';
import { fetchProperties } from '@/services/api';
import { Property } from '@/types/api';

const listingTypes = [
  { label: 'Any', value: '' },
  { label: 'Sale', value: 'sale' },
  { label: 'Rent', value: 'rent' },
];

const categories = ['', 'Plot', 'House', 'Apartment', 'Commercial', 'Villa', 'Farm House'];

export default function PropertiesScreen() {
  const params = useLocalSearchParams<{ category?: string }>();
  const [properties, setProperties] = useState<Property[]>([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [listingType, setListingType] = useState('');
  const [category, setCategory] = useState(String(params.category || ''));
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const query = useMemo(
    () => ({
      search,
      city,
      listingType,
      category,
      minPrice,
      maxPrice,
      limit: 30,
    }),
    [category, city, listingType, maxPrice, minPrice, search],
  );

  const loadProperties = useCallback(
    async (showRefresh = false) => {
      try {
        setError('');
        if (showRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        const response = await fetchProperties(query);
        setProperties(response.data || []);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : 'Unable to load properties.');
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [query],
  );

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  return (
    <SafeAreaView style={local.safe} edges={['left', 'right']}>
      <FlatList
        data={properties}
        keyExtractor={(item) => item._id}
        contentContainerStyle={local.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => loadProperties(true)} tintColor={palette.gold} />}
        ListHeaderComponent={
          <View style={local.header}>
            <SectionTitle eyebrow="Marketplace" title="Explore properties" />
            <Field label="Search" value={search} onChangeText={setSearch} placeholder="Title, location, category" returnKeyType="search" />
            <View style={local.row}>
              <View style={local.half}>
                <Field label="City" value={city} onChangeText={setCity} placeholder="Sagar" />
              </View>
              <View style={local.half}>
                <Field label="Min price" value={minPrice} onChangeText={setMinPrice} placeholder="500000" keyboardType="numeric" />
              </View>
            </View>
            <Field label="Max price" value={maxPrice} onChangeText={setMaxPrice} placeholder="5000000" keyboardType="numeric" />
            <View style={local.chips}>
              {listingTypes.map((item) => (
                <Button
                  key={item.label}
                  variant={listingType === item.value ? 'secondary' : 'ghost'}
                  style={local.chip}
                  onPress={() => setListingType(item.value)}>
                  {item.label}
                </Button>
              ))}
            </View>
            <View style={local.chips}>
              {categories.map((item) => (
                <Button
                  key={item || 'All'}
                  variant={category === item ? 'secondary' : 'ghost'}
                  style={local.chip}
                  onPress={() => setCategory(item)}>
                  {item || 'All'}
                </Button>
              ))}
            </View>
            {error ? <StateBox title="Could not load properties" message={error} /> : null}
            {loading ? <StateBox loading title="Loading properties" /> : null}
            {!loading && !error ? <Text style={local.count}>{properties.length} listings found</Text> : null}
          </View>
        }
        renderItem={({ item }) => <PropertyCard property={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={!loading && !error ? <StateBox title="No properties found" message="Try changing the filters or pull down to refresh." /> : null}
      />
    </SafeAreaView>
  );
}

const local = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  content: {
    padding: 16,
    paddingBottom: 112,
  },
  header: {
    gap: 14,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  half: {
    flex: 1,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    minHeight: 40,
    paddingHorizontal: 12,
  },
  count: {
    color: palette.muted,
    fontWeight: '700',
  },
});
