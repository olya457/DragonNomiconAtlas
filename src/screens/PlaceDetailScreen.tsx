import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  Pressable,
  ScrollView,
  Share,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

import { PLACES, type Place } from '../data/places';

type Props = NativeStackScreenProps<RootStackParamList, 'PlaceDetail'>;

const BG = require('../assets/background.png');
const ICON_BACK = require('../assets/back.png');
const ICON_BOOKMARK = require('../assets/bookmark.png');

const KEY = 'saved_places_v1';

function parseCoords(coords: string): { lat: number; lon: number } {
  const parts = coords.split(',').map(s => s.trim());
  const lat = Number(parts[0]);
  const lon = Number(parts[1]);
  return { lat: isFinite(lat) ? lat : 0, lon: isFinite(lon) ? lon : 0 };
}

async function getSavedIds(): Promise<string[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function setSavedIds(ids: string[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(ids));
}

async function toggleId(placeId: string): Promise<string[]> {
  const ids = await getSavedIds();
  const next = ids.includes(placeId) ? ids.filter(x => x !== placeId) : [placeId, ...ids];
  await setSavedIds(next);
  return next;
}

export default function PlaceDetailScreen({ route, navigation }: Props) {
  const { placeId } = route.params;
  const { width: W, height: H } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmall = H <= 740 || W <= 370;
  const isTiny = H <= 690 || W <= 350;

  const place = useMemo<Place | undefined>(() => PLACES.find(p => p.id === placeId), [placeId]);

  const [saved, setSaved] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    (async () => {
      const ids = await getSavedIds();
      setSaved(ids.includes(placeId));
    })();
  }, [placeId]);

  const onToggleSave = useCallback(async () => {
    const next = await toggleId(placeId);
    setSaved(next.includes(placeId));
  }, [placeId]);

  const onShare = useCallback(async () => {
    if (!place) return;
    try {
      const msg = `${place.title}\nCoordinates: ${place.coords}\n\n${place.description}`;
      await Share.share({ message: msg });
    } catch {}
  }, [place]);

  if (!place) {
    return (
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={[styles.center, { paddingBottom: Math.max(22, insets.bottom + 16) }]}>
            <Text style={styles.topTitle}>RECOMMENDED PLACE</Text>
            <Text style={styles.notFound}>Not found</Text>

            <Pressable style={styles.backWide} onPress={() => navigation.goBack()}>
              <Text style={styles.backWideText}>BACK</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const { lat, lon } = parseCoords(place.coords);
  const cardRadius = isTiny ? 18 : isSmall ? 19 : 20;
  const cardPad = isTiny ? 12 : isSmall ? 14 : 16;

  const mediaRadius = isTiny ? 14 : isSmall ? 16 : 18;
  const mediaH = isTiny ? 230 : isSmall ? 260 : 300;

  const titleSize = isTiny ? 13.4 : isSmall ? 14 : 14.5;
  const coordsSize = isTiny ? 11.2 : 12;
  const descSize = isTiny ? 13.2 : isSmall ? 13.8 : 14.6;
  const descLine = isTiny ? 20 : isSmall ? 22 : 26;

  const btnH = isTiny ? 42 : 44;
  const btnR = isTiny ? 13 : 14;

  const saveW = isTiny ? 50 : 54;
  const saveH = btnH;

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            styles.scroll,
            {
              paddingBottom: Math.max(24, insets.bottom + 18),
              paddingHorizontal: isTiny ? 14 : 18,
              paddingTop: isTiny ? 8 : 10,
            },
          ]}
        >
          <View style={[styles.topBar, { marginBottom: isTiny ? 8 : 10 }]}>
            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={10}>
              <Image source={ICON_BACK} style={styles.backIcon} />
            </Pressable>

            <Text style={[styles.topTitle, { fontSize: isTiny ? 12 : 12.5 }]}>
              RECOMMENDED PLACE
            </Text>

            <View style={{ width: 40 }} />
          </View>

          <View style={[styles.card, { borderRadius: cardRadius, padding: cardPad }]}>

            <View style={[styles.mediaWrap, { height: mediaH, borderRadius: mediaRadius }]}>
              {!showMap ? (
                <Image
                  source={place.image}
                  style={[styles.media, { borderRadius: mediaRadius }]}
                  resizeMode="cover"
                />
              ) : (
                <MapView
                  style={[styles.media, { borderRadius: mediaRadius }]}
                  provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                  initialRegion={{
                    latitude: lat || 0,
                    longitude: lon || 0,
                    latitudeDelta: 0.15,
                    longitudeDelta: 0.15,
                  }}
                  pitchEnabled={false}
                  rotateEnabled={false}
                  toolbarEnabled={false}
                  zoomControlEnabled={false}
                >
                  <Marker coordinate={{ latitude: lat || 0, longitude: lon || 0 }} />
                </MapView>
              )}
            </View>

            <Text style={[styles.title, { marginTop: isTiny ? 10 : 12, fontSize: titleSize }]}>
              {place.title}
            </Text>

            <Text style={[styles.coords, { fontSize: coordsSize }]}>
              Coordinates: {place.coords}
            </Text>

            <View style={[styles.descBox, { marginBottom: isTiny ? 12 : 14 }]}>
              <Text
                style={[
                  styles.desc,
                  {
                    fontSize: descSize,
                    lineHeight: descLine,
                  },
                ]}
              >
                {place.description}
              </Text>
            </View>

            <View style={[styles.actions, { gap: isTiny ? 8 : 10 }]}>
              <Pressable style={[styles.btnOrange, { height: btnH, borderRadius: btnR }]} onPress={onShare}>
                <Text style={[styles.btnTextDark, { fontSize: isTiny ? 12 : 12.5 }]}>SHARE</Text>
              </Pressable>

              <Pressable
                style={[styles.btnOrange, { height: btnH, borderRadius: btnR }]}
                onPress={() => setShowMap(v => !v)}
              >
                <Text style={[styles.btnTextDark, { fontSize: isTiny ? 12 : 12.5 }]}>
                  {showMap ? 'PHOTO' : 'MAP'}
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.btnSave,
                  { width: saveW, height: saveH, borderRadius: btnR },
                  saved ? styles.btnSaveActive : styles.btnSavePassive,
                ]}
                onPress={onToggleSave}
                hitSlop={8}
              >
                <Image
                  source={ICON_BOOKMARK}
                  style={[
                    styles.saveIcon,
                    { width: isTiny ? 16 : 18, height: isTiny ? 16 : 18 },
                  ]}
                />
              </Pressable>
            </View>
          </View>

          <View style={{ height: isTiny ? 10 : isSmall ? 12 : 18 }} />
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },

  scroll: {},

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  topTitle: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#fff',
  },

  card: {
    backgroundColor: '#6e0c0c',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.14)',
  },

  mediaWrap: {
    width: '100%',
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },

  media: {
    width: '100%',
    height: '100%',
  },

  title: {
    color: '#fff',
    fontWeight: '900',
    marginBottom: 8,
  },

  coords: {
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '800',
    marginBottom: 10,
    ...Platform.select({ android: { paddingBottom: 1 } }),
  },

  descBox: {
    marginTop: 2,
    paddingBottom: 2,
  },

  desc: {
    color: 'rgba(255,255,255,0.92)',
  },

  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  btnOrange: {
    flex: 1,
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btnTextDark: {
    color: '#0b0b0b',
    fontWeight: '900',
    letterSpacing: 0.4,
  },

  btnSave: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFB45E',
  },

  btnSavePassive: {
    backgroundColor: 'rgba(0,0,0,0.18)',
  },

  btnSaveActive: {
    backgroundColor: '#FFB45E',
  },

  saveIcon: {
    resizeMode: 'contain',
    tintColor: '#fff', 
  },

  center: {
    flex: 1,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  notFound: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    marginTop: 8,
    marginBottom: 14,
  },

  backWide: {
    height: 52,
    borderRadius: 16,
    backgroundColor: '#5B8CFF',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  backWideText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.3,
  },
});
