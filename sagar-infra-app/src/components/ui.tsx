import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { PropsWithChildren, ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { resolveImageUrl } from '@/services/api';
import { Property } from '@/types/api';
import { formatCurrency, formatLocation, getCoverImage, getPropertyId } from '@/utils/format';

export const palette = {
  navy: '#0B1D3A',
  navySoft: '#102B52',
  gold: '#D4AF37',
  ink: '#172033',
  muted: '#687386',
  line: '#E5E9F0',
  bg: '#F5F7FA',
  white: '#FFFFFF',
  danger: '#B42318',
  success: '#067647',
};

export function Screen({ children, padded = true }: PropsWithChildren<{ padded?: boolean }>) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        contentContainerStyle={[styles.scrollContent, padded ? styles.padded : null]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <View style={styles.sectionTitle}>
      <View style={{ flex: 1 }}>
        {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
        <Text style={styles.h2}>{title}</Text>
      </View>
      {action}
    </View>
  );
}

export function Button({
  children,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: PropsWithChildren<{
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}>) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        styles[`${variant}Button`],
        disabled ? styles.disabled : null,
        pressed && !disabled ? styles.pressed : null,
        style,
      ]}>
      <Text style={[styles.buttonText, variant === 'ghost' || variant === 'secondary' ? styles.darkButtonText : null]}>
        {children}
      </Text>
    </Pressable>
  );
}

export function Field({ label, ...props }: TextInputProps & { label: string }) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.label}>{label}</Text>
      <TextInput placeholderTextColor="#98A2B3" style={styles.input} {...props} />
    </View>
  );
}

export function StateBox({
  title,
  message,
  loading,
}: {
  title: string;
  message?: string;
  loading?: boolean;
}) {
  return (
    <View style={styles.stateBox}>
      {loading ? <ActivityIndicator color={palette.gold} /> : null}
      <Text style={styles.stateTitle}>{title}</Text>
      {message ? <Text style={styles.stateMessage}>{message}</Text> : null}
    </View>
  );
}

export function PropertyCard({
  property,
  compact = false,
  footer,
}: {
  property: Property;
  compact?: boolean;
  footer?: ReactNode;
}) {
  const imageUrl = resolveImageUrl(getCoverImage(property));
  const href = { pathname: '/property/[id]', params: { id: getPropertyId(property) } } as const;

  return (
    <View style={styles.card}>
      <Link href={href} asChild>
        <Pressable>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={[styles.cardImage, compact ? styles.compactImage : null]} contentFit="cover" />
          ) : (
            <View style={[styles.cardImage, styles.imageFallback]}>
              <Text style={styles.imageFallbackText}>Sagar Infra</Text>
            </View>
          )}
          <View style={styles.cardBody}>
            <View style={styles.badgeRow}>
              <Text style={styles.badge}>{property.category || 'Property'}</Text>
              <Text style={styles.badge}>{property.listingType === 'rent' ? 'Rent' : 'Sale'}</Text>
            </View>
            <Text numberOfLines={2} style={styles.cardTitle}>
              {property.title}
            </Text>
            <Text style={styles.price}>{formatCurrency(property.price)}</Text>
            <Text numberOfLines={1} style={styles.meta}>
              {formatLocation(property.location)}
            </Text>
            <Text style={styles.meta}>
              {property.area ? `${property.area} sq.ft` : 'Area on request'}
              {property.bedrooms ? `  |  ${property.bedrooms} bed` : ''}
              {property.bathrooms ? `  |  ${property.bathrooms} bath` : ''}
            </Text>
          </View>
        </Pressable>
      </Link>
      {footer ? <View style={styles.cardFooter}>{footer}</View> : null}
    </View>
  );
}

export const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.bg,
  },
  scrollContent: {
    paddingBottom: 112,
  },
  padded: {
    padding: 16,
    gap: 18,
  },
  sectionTitle: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 12,
  },
  eyebrow: {
    color: palette.gold,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  h2: {
    color: palette.ink,
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  button: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
  },
  primaryButton: {
    backgroundColor: palette.navy,
    borderColor: palette.navy,
  },
  secondaryButton: {
    backgroundColor: '#FFF8E1',
    borderColor: '#E7D28B',
  },
  ghostButton: {
    backgroundColor: palette.white,
    borderColor: palette.line,
  },
  dangerButton: {
    backgroundColor: '#FEF3F2',
    borderColor: '#FECDCA',
  },
  buttonText: {
    color: palette.white,
    fontSize: 15,
    fontWeight: '800',
  },
  darkButtonText: {
    color: palette.navy,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
  fieldWrap: {
    gap: 7,
  },
  label: {
    color: palette.ink,
    fontWeight: '700',
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    backgroundColor: palette.white,
    paddingHorizontal: 14,
    color: palette.ink,
    fontSize: 15,
  },
  stateBox: {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.white,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
    gap: 8,
  },
  stateTitle: {
    color: palette.ink,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  stateMessage: {
    color: palette.muted,
    lineHeight: 21,
    textAlign: 'center',
  },
  card: {
    backgroundColor: palette.white,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: palette.line,
  },
  cardImage: {
    height: 178,
    width: '100%',
    backgroundColor: '#D9E2EF',
  },
  compactImage: {
    height: 132,
  },
  imageFallback: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: palette.navy,
  },
  imageFallbackText: {
    color: palette.gold,
    fontWeight: '900',
  },
  cardBody: {
    padding: 14,
    gap: 7,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: '#EEF2F6',
    color: palette.navy,
    fontSize: 12,
    fontWeight: '800',
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardTitle: {
    color: palette.ink,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 24,
  },
  price: {
    color: palette.navy,
    fontSize: 18,
    fontWeight: '900',
  },
  meta: {
    color: palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: palette.line,
    padding: 12,
  },
});
