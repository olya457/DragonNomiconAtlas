import React from 'react';
import { View, Image, Pressable, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import type { TabsParamList } from './types';

import HomeScreen from '../screens/HomeScreen';
import PlacesListScreen from '../screens/PlacesListScreen';
import QuizScreen from '../screens/QuizScreen';
import SavedPlacesScreen from '../screens/SavedPlacesScreen';
import FireRushScreen from '../screens/FireRushScreen';

const Tab = createBottomTabNavigator<TabsParamList>();

const ICON_HOME = require('../assets/tab_home.png');
const ICON_PLACES = require('../assets/tab_pin.png');
const ICON_QUIZ = require('../assets/tab_quiz.png');
const ICON_FIRE = require('../assets/tab_fire.png');
const ICON_SAVED = require('../assets/tab_bookmark.png');

function TabIcon({ focused, source }: { focused: boolean; source: any }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Image source={source} style={styles.icon} resizeMode="contain" />
    </View>
  );
}

function TabButton({ onPress, accessibilityState, children }: any) {
  const focused = !!accessibilityState?.selected;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.btn,
        pressed && { opacity: Platform.OS === 'ios' ? 0.75 : 0.9 },
        focused && { opacity: 1 },
      ]}
      android_ripple={{ color: 'rgba(255,255,255,0.10)', borderless: true }}
      hitSlop={12}
    >
      {children}
    </Pressable>
  );
}

export default function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarButton: props => <TabButton {...props} />,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={ICON_HOME} />,
        }}
      />

      <Tab.Screen
        name="Places"
        component={PlacesListScreen}
        options={{
          tabBarButton: props => <TabButton {...props} />,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={ICON_PLACES} />,
        }}
      />

      <Tab.Screen
        name="Quiz"
        component={QuizScreen}
        options={{
          tabBarButton: props => <TabButton {...props} />,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={ICON_QUIZ} />,
        }}
      />

      <Tab.Screen
        name="FireRush"
        component={FireRushScreen}
        options={{
          tabBarButton: props => <TabButton {...props} />,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={ICON_FIRE} />,
        }}
      />

      <Tab.Screen
        name="Saved"
        component={SavedPlacesScreen}
        options={{
          tabBarButton: props => <TabButton {...props} />,
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} source={ICON_SAVED} />,
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: Platform.OS === 'android' ? 60 : 40,
    height: 78,
    backgroundColor: '#7A0000',
    borderRadius: 28,
    borderWidth: 2,
    borderColor: '#FFB45E',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    width: 54,
    height: 54,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFB45E',
    backgroundColor: 'rgba(0,0,0,0)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: {
    backgroundColor: '#FFB45E',
  },
  icon: {
    width: 26,
    height: 26,
    tintColor: '#fff',
  },
});
