import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { RootStackParamList } from './types';

import LoaderScreen from '../screens/LoaderScreen';
import OnboardScreen from '../screens/OnboardScreen';
import TabsNavigator from './TabsNavigator';
import PlaceDetailScreen from '../screens/PlaceDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Loader" component={LoaderScreen} />
        <Stack.Screen name="Onboard" component={OnboardScreen} />
        <Stack.Screen name="Tabs" component={TabsNavigator} />
        <Stack.Screen name="PlaceDetail" component={PlaceDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
