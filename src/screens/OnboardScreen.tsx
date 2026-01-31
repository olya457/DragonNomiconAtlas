import React, { useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboard'>;
const BG = require('../assets/background.png');
const IMG_1 = require('../assets/onboard1.png');
const IMG_2 = require('../assets/onboard2.png');
const IMG_3 = require('../assets/onboard3.png');
const IMG_4 = require('../assets/onboard4.png');

type Slide = {
  key: string;
  image: any;
  text: string;
  action: 'next' | 'start';
};

export default function OnboardScreen({ navigation }: Props) {
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const listRef = useRef<FlatList<Slide>>(null);
  const isSmall = H <= 700 || W <= 360;

  const slides = useMemo<Slide[]>(
    () => [
      {
        key: '1',
        image: IMG_1,
        text: 'I am Auron.\nI have watched these lands\nlong before maps had names.',
        action: 'next',
      },
      {
        key: '2',
        image: IMG_2,
        text:
          'These lands remember more\nthan people do.\n' +
          'I marked the places where nature\nshaped legends.\n' +
          'Explore real locations across\nAustralia and Canada.',
        action: 'next',
      },
      {
        key: '3',
        image: IMG_3,
        text:
          'When you reach these places,\n' +
          'they become part of your path.\n\n' +
          'Mark locations you have visited.\n' +
          'Build your personal atlas.',
        action: 'next',
      },
      {
        key: '4',
        image: IMG_4,
        text: 'Earn travel medals.\nUnlock dragon wallpapers\nthrough quizzes.',
        action: 'start',
      },
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const topBlockH = isSmall ? Math.min(H * 0.46, 330) : Math.min(H * 0.52, 420);
  const topOffset = 20;
  const bottomMargin = 30 + 80;
  const sidePad = isSmall ? 14 : 18;
  const cardRadius = isSmall ? 16 : 18;
  const cardPadTop = isSmall ? 14 : 18;
  const cardPadBottom = isSmall ? 14 : 18;
  const textSize = isSmall ? 12 : 12.5;
  const lineH = isSmall ? 16.5 : 17.5;

  const btnSize = isSmall ? 48 : 52;
  const btnRadius = isSmall ? 14 : 16;
  const btnIconSize = isSmall ? 26 : 28;

  const goTo = (i: number) => {
    listRef.current?.scrollToOffset({ offset: i * W, animated: true });
    setIndex(i);
  };

  const onPrimary = () => {
    const slide = slides[index];
    if (slide.action === 'start') {
      navigation.replace('Tabs');
      return;
    }
    const next = Math.min(index + 1, slides.length - 1);
    goTo(next);
  };

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <FlatList
          ref={listRef}
          data={slides}
          keyExtractor={(it) => it.key}
          horizontal
          pagingEnabled
          scrollEnabled={false} 
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={[styles.page, { width: W }]}>
              <View style={[styles.top, { height: topBlockH, paddingTop: topOffset }]}>
                <Image source={item.image} style={styles.topImage} resizeMode="contain" />
              </View>
              <View
                style={[
                  styles.bottomCard,
                  {
                    marginBottom: bottomMargin,
                    marginLeft: sidePad,
                    marginRight: sidePad,
                    borderRadius: cardRadius,
                    paddingTop: cardPadTop,
                    paddingBottom: cardPadBottom,
                    paddingHorizontal: sidePad,
                  },
                ]}
              >
                <Text style={[styles.bottomText, { fontSize: textSize, lineHeight: lineH }]}>
                  {item.text}
                </Text>

                <Pressable
                  style={[
                    styles.roundBtn,
                    { width: btnSize, height: btnSize, borderRadius: btnRadius },
                  ]}
                  onPress={onPrimary}
                >
                  <Text style={[styles.roundBtnIcon, { fontSize: btnIconSize }]}>›</Text>
                </Pressable>
              </View>
            </View>
          )}
        />

        <View
          style={[
            styles.dots,
            {
              paddingBottom: Math.max(10, insets.bottom ? 8 : 10),
              height: isSmall ? 40 : 46,
            },
          ]}
        >
          {slides.map((_, i) => (
            <View key={String(i)} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },

  page: {
    flex: 1,
    justifyContent: 'space-between',
  },

  top: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: '92%',
    height: '92%',
  },

  bottomCard: {
    backgroundColor: '#6e0c0c',
    alignItems: 'center',
  },

  bottomText: {
    color: 'rgba(255,255,255,0.92)',
    textAlign: 'center',
    marginBottom: 14,
  },

  roundBtn: {
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roundBtnIcon: {
    color: '#fff',
    fontWeight: '900',
    marginTop: -2,
  },

  dots: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    transform: [{ scale: 1.05 }],
  },
});
