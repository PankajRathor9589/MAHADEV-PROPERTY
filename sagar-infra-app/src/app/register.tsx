import { Link, router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button, Field, palette, Screen, StateBox } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');
      await signUp({ name, email, phone, password });
      router.replace('/profile');
    } catch (registerError) {
      setError(registerError instanceof Error ? registerError.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View style={local.panel}>
        <Text style={local.title}>Create your account</Text>
        <Text style={local.copy}>Register once to save favorites and send property visit requests.</Text>
        {error ? <StateBox title="Registration error" message={error} /> : null}
        <Field label="Name" value={name} onChangeText={setName} placeholder="Full name" />
        <Field label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" placeholder="you@example.com" />
        <Field label="Phone" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="10-digit mobile number" />
        <Field label="Password" value={password} onChangeText={setPassword} secureTextEntry placeholder="Minimum 6 characters" />
        <Button disabled={loading} onPress={handleSubmit}>
          {loading ? 'Creating account...' : 'Register'}
        </Button>
        <Link href="/login" style={local.link}>
          Already have an account? Login
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
