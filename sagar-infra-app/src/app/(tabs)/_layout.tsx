import { Tabs } from 'expo-router';
import { Text } from 'react-native';

import { palette } from '@/components/ui';

const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ color: focused ? palette.gold : '#98A2B3', fontSize: 12, fontWeight: '900' }}>{label}</Text>
);

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: palette.navy },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: '800' },
        tabBarActiveTintColor: palette.gold,
        tabBarInactiveTintColor: '#98A2B3',
        tabBarStyle: {
          backgroundColor: palette.navy,
          borderTopColor: palette.navySoft,
          minHeight: 68,
          paddingTop: 8,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontWeight: '800', fontSize: 12 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarIcon: ({ focused }) => <TabIcon label="H" focused={focused} /> }} />
      <Tabs.Screen
        name="properties"
        options={{ title: 'Properties', tabBarIcon: ({ focused }) => <TabIcon label="P" focused={focused} /> }}
      />
      <Tabs.Screen
        name="favorites"
        options={{ title: 'Favorites', tabBarIcon: ({ focused }) => <TabIcon label="F" focused={focused} /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile', tabBarIcon: ({ focused }) => <TabIcon label="U" focused={focused} /> }}
      />
    </Tabs>
  );
}
