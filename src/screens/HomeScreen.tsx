import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  Share,
  ScrollView,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { TabsParamList, RootStackParamList } from '../navigation/types';

import { FACTS } from '../data/facts';
import { PLACES, type Place } from '../data/places';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

const BG = require('../assets/background.png');
const DRAGON = require('../assets/onboard1.png');

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export default function HomeScreen({ navigation }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmall = H <= 700 || W <= 360;
  const isTiny = H <= 660 || W <= 340;

  const [fact, setFact] = useState<string>(() => pickRandom(FACTS));
  const [place, setPlace] = useState<Place>(() => pickRandom(PLACES));

  useFocusEffect(
    React.useCallback(() => {
      setFact(pickRandom(FACTS));
      setPlace(pickRandom(PLACES));
    }, [])
  );

  const padX = isTiny ? 14 : isSmall ? 16 : 20;

  const gapTop = isTiny ? 8 : isSmall ? 10 : 18;
  const gapSection = isTiny ? 16 : isSmall ? 18 : 26;

  const cardR = isTiny ? 18 : isSmall ? 20 : 22;
  const cardPY = isTiny ? 12 : isSmall ? 14 : 18;
  const cardPX = isTiny ? 12 : isSmall ? 14 : 16;
  const dragonW = isTiny ? 54 : isSmall ? 60 : 76;
  const dragonH = isTiny ? 74 : isSmall ? 84 : 110;

  const placeImgW = isTiny ? 94 : isSmall ? 102 : 126;
  const placeImgH = isTiny ? 128 : isSmall ? 140 : 178;
  const btnH = isTiny ? 40 : isSmall ? 42 : 46;
  const btnR = isTiny ? 14 : 16;

  const shareFactBtnH = isTiny ? 40 : isSmall ? 42 : 44;
  const factFont = isTiny ? 11.8 : isSmall ? 12.4 : 14.2;
  const factLH = isTiny ? 16.8 : isSmall ? 18.0 : 19.5;

  const placeTitleFont = isTiny ? 13.6 : isSmall ? 14.6 : 16.4;
  const placeMetaFont = isTiny ? 11.0 : isSmall ? 11.4 : 12.2;
  const placeDescFont = isTiny ? 11.6 : isSmall ? 12.2 : 13.2;
  const placeDescLH = isTiny ? 16.6 : 18.0;
  const coordsFont = isTiny ? 11.0 : isSmall ? 11.4 : 12.2;

  const onShareFact = async () => {
    try {
      await Share.share({ message: fact });
    } catch {}
  };

  const onSharePlace = async () => {
    try {
      const msg = `${place.title}\n${place.coords}\n\n${place.description}`;
      await Share.share({ message: msg });
    } catch {}
  };

  const onOpenPlace = () => {
    navigation.navigate('PlaceDetail', { placeId: place.id });
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.content,
            {
              paddingHorizontal: padX,
              paddingTop: gapTop,
              paddingBottom: Math.max(44, insets.bottom + 22),
            },
          ]}
        >
    
          <View
            style={[
              styles.factCard,
              {
                borderRadius: cardR,
                paddingVertical: cardPY,
                paddingHorizontal: cardPX,
              },
            ]}
          >
            <Image
              source={DRAGON}
              style={[styles.dragonBase, { width: dragonW, height: dragonH }]}
              resizeMode="contain"
            />

            <View style={styles.factTextBox}>
              <Text style={[styles.factText, { fontSize: factFont, lineHeight: factLH }]}>
                {fact}
              </Text>

              <Pressable
                style={[
                  styles.shareBtn,
                  {
                    height: shareFactBtnH,
                    borderRadius: btnR,
                    paddingHorizontal: isTiny ? 16 : isSmall ? 18 : 22,
                    marginTop: isTiny ? 10 : 12,
                  },
                ]}
                onPress={onShareFact}
              >
                <Text style={[styles.shareBtnText, { fontSize: isTiny ? 12 : 12.5 }]}>SHARE</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.rowHeader, { marginTop: gapSection }]}>
            <Text style={[styles.sectionTitle, { fontSize: isTiny ? 12 : 12.5 }]}>
              RECOMMENDED PLACE
            </Text>

            <Pressable onPress={() => navigation.navigate('Places')}>
              <Text style={[styles.openMore, { fontSize: isTiny ? 13.2 : 14.5 }]}>Open more</Text>
            </Pressable>
          </View>

          <View
            style={[
              styles.placeCard,
              {
                borderRadius: cardR,
                paddingVertical: isTiny ? 12 : isSmall ? 14 : 16,
                paddingHorizontal: cardPX,
              },
            ]}
          >
            <Image
              source={place.image}
              style={[
                styles.placeImg,
                {
                  width: placeImgW,
                  height: placeImgH,
                  borderRadius: isTiny ? 16 : isSmall ? 18 : 20,
                },
              ]}
              resizeMode="cover"
            />

            <View style={[styles.placeInfo, { paddingRight: isTiny ? 2 : 6 }]}>
              <Text style={[styles.placeTitle, { fontSize: placeTitleFont }]} numberOfLines={2}>
                {place.title}
              </Text>

              <Text style={[styles.placeMeta, { fontSize: placeMetaFont }]} numberOfLines={1}>
                {place.category}
              </Text>

              <Text
                style={[
                  styles.placeDesc,
                  { fontSize: placeDescFont, lineHeight: placeDescLH },
                ]}
                numberOfLines={isTiny ? 3 : isSmall ? 4 : 5}
              >
                {place.description}
              </Text>

              <Text style={[styles.coords, { fontSize: coordsFont, marginTop: isTiny ? 8 : 10 }]}>
                {place.coords}
              </Text>

              <View style={[styles.placeActions, { marginTop: isTiny ? 10 : 14, gap: isTiny ? 10 : 12 }]}>
                <Pressable style={[styles.actionBtn, { height: btnH, borderRadius: btnR }]} onPress={onSharePlace}>
                  <Text style={[styles.actionBtnText, { fontSize: isTiny ? 12.2 : 13 }]}>SHARE</Text>
                </Pressable>

                <Pressable style={[styles.actionBtn, { height: btnH, borderRadius: btnR }]} onPress={onOpenPlace}>
                  <Text style={[styles.actionBtnText, { fontSize: isTiny ? 12.2 : 13 }]}>OPEN</Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View
            style={[
              styles.quizCard,
              {
                marginTop: isTiny ? 14 : isSmall ? 16 : 22,
                borderRadius: cardR,
                paddingVertical: isTiny ? 12 : isSmall ? 14 : 18,
                paddingHorizontal: cardPX,
              },
            ]}
          >
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={[styles.quizTitle, { fontSize: isTiny ? 12.0 : isSmall ? 12.3 : 13 }]}>
                QUIZ:
              </Text>
              <Text style={[styles.quizText, { fontSize: isTiny ? 11.8 : isSmall ? 12.2 : 13.2 }]}>
                Complete Quiz. Unlock Wallpapers
              </Text>
            </View>

            <Pressable
              style={[
                styles.quizGoBtn,
                {
                  width: isTiny ? 46 : isSmall ? 50 : 54,
                  height: isTiny ? 46 : isSmall ? 50 : 54,
                  borderRadius: isTiny ? 15 : isSmall ? 16 : 18,
                },
              ]}
              onPress={() => navigation.navigate('Quiz')}
            >
              <Text style={[styles.quizGoIcon, { fontSize: isTiny ? 28 : isSmall ? 30 : 32 }]}>›</Text>
            </Pressable>
          </View>

          <View style={{ height: isTiny ? 8 : isSmall ? 10 : 18 }} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },

  content: {

  },

  factCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6e0c0c',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  dragonBase: {
    marginRight: 12,
  },
  factTextBox: { flex: 1 },
  factText: {
    color: 'rgba(255,255,255,0.92)',
  },
  shareBtn: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareBtnText: {
    color: '#0b0b0b',
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  rowHeader: {
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  openMore: {
    color: 'rgba(255,255,255,0.9)',
    textDecorationLine: 'underline',
    ...Platform.select({ android: { paddingBottom: 1 } }),
  },

  placeCard: {
    backgroundColor: '#6e0c0c',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  placeImg: {
    marginRight: 12,
  },
  placeInfo: {
    flex: 1,
  },
  placeTitle: {
    color: '#fff',
    fontWeight: '900',
    marginBottom: 6,
  },
  placeMeta: {
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '800',
    marginBottom: 8,
  },
  placeDesc: {
    color: 'rgba(255,255,255,0.88)',
  },
  coords: {
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '700',
  },

  placeActions: {
    flexDirection: 'row',
  },
  actionBtn: {
    flex: 1,
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: '#0b0b0b',
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  quizCard: {
    backgroundColor: '#6e0c0c',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  quizTitle: {
    color: 'rgba(255,255,255,0.95)',
    fontWeight: '900',
    marginBottom: 5,
    letterSpacing: 0.5,
  },
  quizText: {
    color: 'rgba(255,255,255,0.86)',
    lineHeight: 17,
  },
  quizGoBtn: {
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quizGoIcon: {
    color: '#fff',
    fontWeight: '900',
    marginTop: -2,
  },
});
