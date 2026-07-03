import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Field, palette, Screen, StateBox } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await signIn({ email, password });
      router.replace('/profile');
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={local.panel}>
        <Text style={local.title}>Login to Sagar Infra</Text>
        <Text style={local.copy}>Save listings, manage your shortlist, and submit property inquiries faster.</Text>
        {error ? <StateBox title="Login error" message={error} /> : null}
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimum 6 characters" />
        <Button disabled={loading} onPress={handleSubmit}>
          {loading ? 'Logging in...' : 'Login'}
        </Button>
        <Link href="/register" style={local.link}>
          Create a new account
        </Link>
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
    gap: 14,
  },
  title: {
    color: palette.ink,
    fontSize: 26,
    fontWeight: '900',
  },
  copy: {
    color: palette.muted,
    lineHeight: 22,
  },
  link: {
    color: palette.navy,
    fontWeight: '800',
    textAlign: 'center',
    padding: 8,
  },
});
