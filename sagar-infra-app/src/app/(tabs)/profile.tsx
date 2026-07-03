import { router } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Button, palette, Screen, SectionTitle } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { COMPANY_ADDRESS, COMPANY_EMAIL, COMPANY_PHONE } from '@/utils/format';

export default function ProfileScreen() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <Screen>
      <SectionTitle eyebrow="Account" title={isAuthenticated ? 'Your profile' : 'Welcome to Sagar Infra'} />

      <View style={local.panel}>
        {isAuthenticated ? (
          <>
            <Text style={local.name}>{user?.name}</Text>
            <Text style={local.muted}>{user?.email}</Text>
            {user?.phone ? <Text style={local.muted}>{user.phone}</Text> : null}
            <View style={local.actions}>
              <Button variant="ghost" onPress={() => router.push('/favorites')}>
                My Favorites
              </Button>
              <Button variant="ghost" onPress={() => router.push('/properties')}>
                Browse Properties
              </Button>
              <Button variant="danger" onPress={logout}>
                Logout
              </Button>
            </View>
          </>
        ) : (
          <>
            <Text style={local.name}>Login to save properties and submit faster inquiries.</Text>
            <View style={local.actions}>
              <Button onPress={() => router.push('/login')}>Login</Button>
              <Button variant="ghost" onPress={() => router.push('/register')}>
                Register
              </Button>
            </View>
          </>
        )}
      </View>

      <View style={local.panel}>
        <SectionTitle eyebrow="About" title="Sagar Infra" />
        <Text style={local.body}>
          Sagar Infra helps buyers and investors discover verified real-estate opportunities across plots, homes,
          shops, and commercial properties.
        </Text>
      </View>

      <View style={local.panel}>
        <SectionTitle eyebrow="Contact" title="Reach us" />
        <Text style={local.body}>{COMPANY_ADDRESS}</Text>
        <Text style={local.body}>Phone: {COMPANY_PHONE}</Text>
        <Text style={local.body}>Email: {COMPANY_EMAIL}</Text>
      </View>
    </Screen>
  );
}

const local = StyleSheet.create({
  panel: {
    backgroundColor: palette.white,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: 8,
    padding: 16,
    gap: 12,
  },
  name: {
    color: palette.ink,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 27,
  },
  muted: {
    color: palette.muted,
    fontSize: 15,
  },
  body: {
    color: palette.muted,
    lineHeight: 22,
  },
  actions: {
    gap: 10,
  },
});
