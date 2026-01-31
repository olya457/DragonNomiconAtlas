import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  FlatList,
  Pressable,
  Image,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { CompositeScreenProps } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { TabsParamList, RootStackParamList } from '../navigation/types';
import { PLACES } from '../data/places';
import { getSavedIds, toggleSavedId } from '../data/savedPlaces';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabsParamList, 'Saved'>,
  NativeStackScreenProps<RootStackParamList>
>;

const BG = require('../assets/background.png');
const ICON_BOOKMARK = require('../assets/bookmark.png');

export default function SavedPlacesScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();

  const isSmall = H <= 740 || W <= 370;
  const isTiny = H <= 690 || W <= 350;

  const [savedIds, setSavedIds] = useState<string[]>([]);

  useFocusEffect(
    useCallback(() => {
      (async () => setSavedIds(await getSavedIds()))();
    }, [])
  );

  const savedPlaces = useMemo(() => PLACES.filter(p => savedIds.includes(p.id)), [savedIds]);

  const onToggleSave = useCallback(async (placeId: string) => {
    const next = await toggleSavedId(placeId);
    setSavedIds(next);
  }, []);

  const extraBottom = 60;
  const imgW = isTiny ? 88 : isSmall ? 96 : 108;
  const imgH = isTiny ? 112 : isSmall ? 122 : 138;

  const cardPad = isTiny ? 12 : isSmall ? 14 : 16;
  const cardRadius = isTiny ? 22 : 26;

  const openH = isTiny ? 44 : isSmall ? 48 : 50;
  const openR = isTiny ? 16 : isSmall ? 16 : 18;

  const saveSize = isTiny ? 46 : isSmall ? 50 : 54;
  const saveR = isTiny ? 16 : isSmall ? 16 : 18;

  const listBottomPad = Math.max(26, insets.bottom + 18) + extraBottom;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.topBar, { paddingTop: Math.max(8, insets.top ? 6 : 8) }]}>
          <Text style={[styles.topTitle, { fontSize: isTiny ? 14 : 16 }]}>SAVED</Text>
        </View>

        {savedPlaces.length === 0 ? (
          <View style={[styles.emptyWrap, { paddingBottom: listBottomPad }]}>
            <Text style={[styles.emptyText, { fontSize: isTiny ? 13 : 14 }]}>
            </Text>
          </View>
        ) : (
          <FlatList
            data={savedPlaces}
            keyExtractor={i => i.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.list,
              {
                paddingBottom: listBottomPad, 
                paddingHorizontal: isTiny ? 12 : 14,
              },
            ]}
            renderItem={({ item }) => {
              const saved = savedIds.includes(item.id);

              return (
                <View style={[styles.card, { borderRadius: cardRadius, padding: cardPad }]}>
                  <View style={styles.cardInner}>
                    <Image
                      source={item.image}
                      style={[
                        styles.placeImg,
                        {
                          width: imgW,
                          height: imgH,
                          borderRadius: isTiny ? 16 : isSmall ? 18 : 20,
                        },
                      ]}
                      resizeMode="cover"
                    />

                    <View style={styles.right}>
                      <Text
                        style={[
                          styles.title,
                          { fontSize: isTiny ? 12.8 : isSmall ? 13.2 : 14.2 },
                        ]}
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>

                      <Text
                        style={[
                          styles.desc,
                          {
                            fontSize: isTiny ? 11.2 : isSmall ? 11.6 : 12.2,
                            lineHeight: isTiny ? 16 : 17,
                          },
                        ]}
                        numberOfLines={isTiny ? 2 : 3}
                      >
                        {item.description}
                      </Text>

                      <View style={[styles.actionsRow, { marginTop: isTiny ? 10 : 12 }]}>
                        <Pressable
                          style={[styles.openBtn, { height: openH, borderRadius: openR }]}
                          onPress={() => navigation.navigate('PlaceDetail', { placeId: item.id })}
                        >
                          <Text style={[styles.openText, { fontSize: isTiny ? 13 : 14 }]}>Open</Text>
                        </Pressable>

                        <Pressable
                          style={[
                            styles.saveBtn,
                            {
                              width: saveSize,
                              height: saveSize,
                              borderRadius: saveR,
                            },
                            saved ? styles.saveBtnOn : styles.saveBtnOff,
                          ]}
                          onPress={() => onToggleSave(item.id)}
                          hitSlop={8}
                        >
                          <Image
                            source={ICON_BOOKMARK}
                            style={[
                              styles.saveImg,
                              { width: isTiny ? 16 : 18, height: isTiny ? 16 : 18 },
                            ]}
                          />
                        </Pressable>
                      </View>
                    </View>
                  </View>
                </View>
              );
            }}
          />
        )}
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },

  topBar: {
    paddingHorizontal: 14,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topTitle: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '900',
    letterSpacing: 1,
  },

  emptyWrap: {
    flex: 1,
    paddingHorizontal: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '700',
    textAlign: 'center',
  },

  list: {
    paddingTop: 6,
  },

  card: {
    marginBottom: 16,
    backgroundColor: '#6e0c0c',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeImg: {
    marginRight: 14,
  },
  right: {
    flex: 1,
    paddingRight: 2,
  },
  title: {
    color: '#fff',
    fontWeight: '900',
    marginBottom: 8,
  },
  desc: {
    color: 'rgba(255,255,255,0.86)',
  },

  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  openBtn: {
    flex: 1,
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  openText: {
    color: '#0b0b0b',
    fontWeight: '900',
    letterSpacing: 0.3,
  },

  saveBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFB45E',
  },
  saveBtnOff: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  saveBtnOn: {
    backgroundColor: '#FFB45E',
  },
  saveImg: {
    resizeMode: 'contain',
    tintColor: '#fff',
  },
});
