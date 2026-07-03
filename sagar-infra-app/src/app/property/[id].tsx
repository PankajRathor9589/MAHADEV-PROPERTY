import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button, Field, palette, Screen, SectionTitle, StateBox } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { addFavorite, fetchFavorites, fetchPropertyById, removeFavorite, resolveImageUrl, submitInquiry } from '@/services/api';
import { Property } from '@/types/api';
import { buildMapUrl, buildWhatsAppUrl, formatCurrency, formatLocation, getCoverImage, normalizePhone } from '@/utils/format';

export default function PropertyDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, isAuthenticated, refreshUser } = useAuth();
  const [property, setProperty] = useState<Property | null>(null);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const loadProperty = useCallback(async () => {
    if (!id) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const nextProperty = await fetchPropertyById(id);
      setProperty(nextProperty);

      if (isAuthenticated) {
        const favorites = await fetchFavorites();
        setFavoriteIds(favorites.map((item) => item._id));
      }
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Unable to load property.');
    } finally {
      setLoading(false);
    }
  }, [id, isAuthenticated]);

  useEffect(() => {
    loadProperty();
  }, [loadProperty]);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: current.name || user?.name || '',
      phone: current.phone || user?.phone || '',
      email: current.email || user?.email || '',
    }));
  }, [user]);

  const images = useMemo(() => {
    const fromImages = property?.images?.map((item) => item.url) || [];
    const fromMedia = property?.media?.filter((item) => item.type === 'image').map((item) => item.url) || [];
    return [...new Set([...fromImages, ...fromMedia])];
  }, [property]);

  const contactPhone = property?.contactPhone || property?.postedBy?.phone;
  const isFavorite = Boolean(property?._id && favoriteIds.includes(property._id));

  const handleFavorite = async () => {
    if (!property?._id) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    try {
      setBusy(true);
      setActionError('');
      const nextFavorites = isFavorite ? await removeFavorite(property._id) : await addFavorite(property._id);
      setFavoriteIds(nextFavorites.map((item) => item._id));
      await refreshUser();
    } catch (favoriteError) {
      setActionError(favoriteError instanceof Error ? favoriteError.message : 'Unable to update favorite.');
    } finally {
      setBusy(false);
    }
  };

  const handleInquiry = async () => {
    if (!property?._id) {
      return;
    }

    try {
      setBusy(true);
      setActionError('');
      await submitInquiry({
        propertyId: property._id,
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message || `I want to schedule a site visit for ${property.title}.`,
        source: 'property',
        location: formatLocation(property.location),
      });
      setSent(true);
    } catch (inquiryError) {
      setActionError(inquiryError instanceof Error ? inquiryError.message : 'Unable to submit inquiry.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <StateBox loading title="Loading property details" />
      </Screen>
    );
  }

  if (error || !property) {
    return (
      <Screen>
        <StateBox title="Property unavailable" message={error || 'This property could not be found.'} />
      </Screen>
    );
  }

  const cover = resolveImageUrl(getCoverImage(property));
  const location = formatLocation(property.location);

  return (
    <Screen padded={false}>
      {cover ? <Image source={{ uri: cover }} style={local.cover} contentFit="cover" /> : <View style={[local.cover, local.coverFallback]} />}
      <View style={local.content}>
        {images.length > 1 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={local.gallery}>
            {images.map((image) => (
              <Image key={image} source={{ uri: resolveImageUrl(image) }} style={local.thumb} contentFit="cover" />
            ))}
          </ScrollView>
        ) : null}

        <View style={local.panel}>
          <Text style={local.title}>{property.title}</Text>
          <Text style={local.price}>{formatCurrency(property.price)}</Text>
          <Text style={local.location}>{location}</Text>
          <View style={local.badges}>
            <Text style={local.badge}>{property.category || 'Property'}</Text>
            <Text style={local.badge}>{property.listingType === 'rent' ? 'Rent' : 'Sale'}</Text>
            <Text style={local.badge}>{property.area ? `${property.area} sq.ft` : 'Area on request'}</Text>
          </View>
        </View>

        {actionError ? <StateBox title="Action needed" message={actionError} /> : null}

        <View style={local.actions}>
          <Button onPress={() => Linking.openURL(`tel:${normalizePhone(contactPhone)}`)}>Call</Button>
          <Button
            variant="secondary"
            onPress={() =>
              Linking.openURL(buildWhatsAppUrl(contactPhone, `Hi Sagar Infra, I want details about ${property.title} in ${location}.`))
            }>
            WhatsApp
          </Button>
          <Button variant="ghost" onPress={handleFavorite} disabled={busy}>
            {isFavorite ? 'Saved' : isAuthenticated ? 'Save Property' : 'Login to Save'}
          </Button>
          <Button variant="ghost" onPress={() => Linking.openURL(buildMapUrl(property))}>
            Open Map
          </Button>
        </View>

        <View style={local.panel}>
          <SectionTitle eyebrow="Details" title="Property overview" />
          <Text style={local.description}>{property.description || 'Full property details are available on request.'}</Text>
          <View style={local.factGrid}>
            <Fact label="Bedrooms" value={property.bedrooms ? String(property.bedrooms) : 'N/A'} />
            <Fact label="Bathrooms" value={property.bathrooms ? String(property.bathrooms) : 'N/A'} />
            <Fact label="Area" value={property.area ? `${property.area} sq.ft` : 'On request'} />
            <Fact label="Contact" value={property.contactName || property.postedBy?.name || 'Sagar Infra'} />
          </View>
        </View>

        <View style={local.panel}>
          <SectionTitle eyebrow="Amenities" title="Highlights" />
          <View style={local.amenities}>
            {(property.amenities?.length ? property.amenities : ['Site visit support', 'Location guidance', 'Verified listing']).map((item) => (
              <Text key={item} style={local.amenity}>
                {item}
              </Text>
            ))}
          </View>
        </View>

        <View style={local.panel}>
          <SectionTitle eyebrow="Inquiry" title="Book a site visit" />
          {sent ? <StateBox title="Inquiry sent" message="Sagar Infra will contact you soon." /> : null}
          <Field label="Name" value={form.name} onChangeText={(value) => setForm((current) => ({ ...current, name: value }))} />
          <Field label="Phone" value={form.phone} onChangeText={(value) => setForm((current) => ({ ...current, phone: value }))} keyboardType="phone-pad" />
          <Field label="Email" value={form.email} onChangeText={(value) => setForm((current) => ({ ...current, email: value }))} keyboardType="email-address" autoCapitalize="none" />
          <Field
            label="Requirement"
            value={form.message}
            onChangeText={(value) => setForm((current) => ({ ...current, message: value }))}
            multiline
            placeholder="Preferred visit time, budget, or questions"
          />
          <Button disabled={busy} onPress={handleInquiry}>
            {busy ? 'Submitting...' : 'Submit Inquiry'}
          </Button>
        </View>
      </View>
    </Screen>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View style={local.fact}>
      <Text style={local.factLabel}>{label}</Text>
      <Text style={local.factValue}>{value}</Text>
    </View>
  );
}

const local = StyleSheet.create({
  cover: {
    height: 290,
    width: '100%',
    backgroundColor: '#D9E2EF',
  },
  coverFallback: {
    backgroundColor: palette.navy,
  },
  content: {
    padding: 16,
    paddingBottom: 112,
    gap: 14,
  },
  gallery: {
    gap: 10,
  },
  thumb: {
    width: 112,
    height: 84,
    borderRadius: 8,
    backgroundColor: '#D9E2EF',
  },
  panel: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  title: {
    color: palette.ink,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
  },
  price: {
    color: palette.navy,
    fontSize: 24,
    fontWeight: '900',
  },
  location: {
    color: palette.muted,
    lineHeight: 21,
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#EEF2F6',
    color: palette.navy,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  actions: {
    gap: 10,
  },
  description: {
    color: palette.muted,
    lineHeight: 23,
  },
  factGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fact: {
    width: '48%',
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    padding: 12,
  },
  factLabel: {
    color: palette.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  factValue: {
    color: palette.ink,
    fontSize: 16,
    fontWeight: '900',
    marginTop: 4,
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  amenity: {
    overflow: 'hidden',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: palette.line,
    color: palette.ink,
    paddingHorizontal: 11,
    paddingVertical: 7,
    fontWeight: '700',
  },
});
