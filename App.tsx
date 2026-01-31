import React from 'react';
import { StatusBar, Platform } from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <>
      <RootNavigator />
    </>
  );
}
