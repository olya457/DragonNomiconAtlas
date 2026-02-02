import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  useWindowDimensions,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BG = require('../assets/background.png');
const ICON_BACK = require('../assets/back.png');

const FLAMES = require('../assets/flames.png');
const DRAGON = require('../assets/onboard1.png');

const BADGE_1 = require('../assets/badge_1.png');
const BADGE_2 = require('../assets/badge_2.png');
const BADGE_3 = require('../assets/badge_3.png');
const BADGE_4 = require('../assets/badge_4.png');
const BADGE_5 = require('../assets/badge_5.png');

type Phase = 'idle' | 'round' | 'result';

const TOTAL_ROUNDS = 10;
const ROUND_SECONDS = 20;
const STORAGE_KEYS = {
  round: 'fire_rush_round',
  hitsTotal: 'fire_rush_hits_total',
};

function passTapsForRound(round: number) {
  const r = Math.max(1, Math.min(round, TOTAL_ROUNDS));
  return 10 + (r - 1) * 5;
}

function reactionMsForRound(round: number) {
  const r = Math.max(1, Math.min(round, TOTAL_ROUNDS));
  const start = 900;
  const end = 420;
  const t = (r - 1) / (TOTAL_ROUNDS - 1);
  return Math.round(start + (end - start) * t);
}

function clamp(n: number, a: number, b: number) {
  return Math.max(a, Math.min(b, n));
}

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function FireFlicker() {
  const { width: W, height: H } = useWindowDimensions();
  const isSmall = H <= 740 || W <= 370;
  const isTiny = H <= 690 || W <= 350;

  const flick = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(flick, {
          toValue: 1,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(flick, {
          toValue: 0,
          duration: 520,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [flick]);

  const opacity = flick.interpolate({ inputRange: [0, 1], outputRange: [0.55, 0.8] });
  const scale = flick.interpolate({ inputRange: [0, 1], outputRange: [1, 1.025] });

  const h = isTiny ? 190 : isSmall ? 220 : 270;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.fireWrap,
        {
          height: h,
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Image source={FLAMES} style={styles.fireImg} resizeMode="cover" />
    </Animated.View>
  );
}

export default function FireRushScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();

  const isSmall = H <= 740 || W <= 370;
  const isTiny = H <= 690 || W <= 350;
  const navBarPad = isTiny ? 72 : isSmall ? 80 : 88;
  const bottomPad = Math.max(insets.bottom, 8) + navBarPad;

  const padH = isTiny ? 12 : isSmall ? 14 : 18;
  const playW = W - padH * 2;

  const topSafe = isTiny ? 2 : isSmall ? 4 : 8;

  const flamesH = isTiny ? 190 : isSmall ? 220 : 270;

  const topToHudGap = isTiny ? 4 : isSmall ? 6 : 8;
  const hudToFieldGap = isTiny ? 6 : isSmall ? 8 : 10;

  const startBtnH = isTiny ? 42 : isSmall ? 46 : 52;

  const baseOffset = (isTiny ? 124 : isSmall ? 132 : 144) + bottomPad + startBtnH;
  const playH = clamp(H - topSafe - flamesH - baseOffset, isTiny ? 250 : 280, 620) + 20;

  const dragonSize = isTiny ? 58 : isSmall ? 66 : 74;

  const [phase, setPhase] = useState<Phase>('idle');
  const [round, setRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS);

  const [score, setScore] = useState(0);
  const [hitsTotal, setHitsTotal] = useState(0);

  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const secTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const missTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const runningRef = useRef(false);

  const pop = useRef(new Animated.Value(0)).current;
  const popup = useRef(new Animated.Value(0)).current;

  const stopAll = useCallback(() => {
    runningRef.current = false;

    if (secTimerRef.current) clearInterval(secTimerRef.current);
    secTimerRef.current = null;

    if (missTimerRef.current) clearTimeout(missTimerRef.current);
    missTimerRef.current = null;
  }, []);

  const runPop = useCallback(() => {
    pop.setValue(0);
    Animated.spring(pop, {
      toValue: 1,
      friction: 6,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [pop]);

  const showPopup = useCallback(() => {
    popup.setValue(0);
    Animated.spring(popup, {
      toValue: 1,
      friction: 7,
      tension: 90,
      useNativeDriver: true,
    }).start();
  }, [popup]);

  const persistProgress = useCallback(async (nextRound: number, nextHitsTotal?: number) => {
    try {
      const r = clamp(nextRound, 1, TOTAL_ROUNDS);
      await AsyncStorage.setItem(STORAGE_KEYS.round, String(r));
      if (typeof nextHitsTotal === 'number') {
        await AsyncStorage.setItem(STORAGE_KEYS.hitsTotal, String(Math.max(0, nextHitsTotal)));
      }
    } catch {}
  }, []);

  const loadProgress = useCallback(async () => {
    try {
      const rStr = await AsyncStorage.getItem(STORAGE_KEYS.round);
      const hStr = await AsyncStorage.getItem(STORAGE_KEYS.hitsTotal);

      const rNum = rStr ? parseInt(rStr, 10) : 1;
      const hNum = hStr ? parseInt(hStr, 10) : 0;

      const safeR = clamp(Number.isFinite(rNum) ? rNum : 1, 1, TOTAL_ROUNDS);
      const safeH = Math.max(0, Number.isFinite(hNum) ? hNum : 0);

      setRound(safeR);
      setHitsTotal(safeH);
    } catch {
      setRound(1);
      setHitsTotal(0);
    }
  }, []);

  const spawnDragon = useCallback(
    (roundNum: number) => {
      if (!runningRef.current) return;

      if (missTimerRef.current) clearTimeout(missTimerRef.current);

      const maxX = Math.max(0, playW - dragonSize);
      const maxY = Math.max(0, playH - dragonSize);

      setPos({ x: rand(0, maxX), y: rand(0, maxY) });
      setVisible(true);
      runPop();

      const reactMs = reactionMsForRound(roundNum);

      missTimerRef.current = setTimeout(() => {
        if (!runningRef.current) return;
        setVisible(false);
        setTimeout(() => spawnDragon(roundNum), 120);
      }, reactMs);
    },
    [dragonSize, playH, playW, runPop]
  );

  const endRound = useCallback(() => {
    stopAll();
    setVisible(false);
    setPhase('result');
    showPopup();
  }, [showPopup, stopAll]);

  const startRound = useCallback(
    (roundNum: number) => {
      stopAll();

      const r = clamp(roundNum, 1, TOTAL_ROUNDS);
      runningRef.current = true;

      setRound(r);
      setScore(0);
      setTimeLeft(ROUND_SECONDS);
      setPhase('round');

      requestAnimationFrame(() => spawnDragon(r));

      secTimerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            endRound();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    },
    [endRound, spawnDragon, stopAll]
  );
  useFocusEffect(
    useCallback(() => {
      let alive = true;

      (async () => {
        await loadProgress();
        if (!alive) return;
        stopAll();
        setPhase('idle');
        setTimeLeft(ROUND_SECONDS);
        setScore(0);
        setVisible(false);
        setPos({ x: 0, y: 0 });
        pop.setValue(0);
        popup.setValue(0);
      })();

      return () => {
        alive = false;
        stopAll();
      };
    }, [loadProgress, pop, popup, stopAll])
  );

  const tapSlop = useMemo(() => {
    const v = isTiny ? 18 : isSmall ? 16 : 14;
    return { top: v, bottom: v, left: v, right: v };
  }, [isSmall, isTiny]);

  const extraTouchPad = useMemo(() => (isTiny ? 12 : isSmall ? 10 : 8), [isSmall, isTiny]);

  const onTapDragon = useCallback(() => {
    if (phase !== 'round') return;
    if (!runningRef.current) return;
    if (!visible) return;

    setScore(s => s + 1);
    setHitsTotal(prev => {
      const next = prev + 1;
      persistProgress(round, next);
      return next;
    });

    setVisible(false);
    spawnDragon(round);
  }, [phase, persistProgress, round, spawnDragon, visible]);

  const needed = useMemo(() => passTapsForRound(round), [round]);
  const passed = score >= needed;

  const onPressStart = useCallback(() => startRound(round), [round, startRound]);

  const onNextRound = useCallback(async () => {
    if (round >= TOTAL_ROUNDS) {
      await persistProgress(1, hitsTotal);
      stopAll();
      setPhase('idle');
      setRound(1);
      setTimeLeft(ROUND_SECONDS);
      setScore(0);
      setVisible(false);
      navigation?.navigate?.('Home');
      return;
    }

    const nextRound = Math.min(TOTAL_ROUNDS, round + 1);
    await persistProgress(nextRound, hitsTotal);

    stopAll();
    setPhase('idle');
    setVisible(false);
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    setRound(nextRound);
  }, [hitsTotal, navigation, persistProgress, round, stopAll]);

  const onRetry = useCallback(() => {
    stopAll();
    setPhase('idle');
    setVisible(false);
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
  }, [stopAll]);

  const onMenu = useCallback(() => {
    stopAll();
    setPhase('idle');
    setVisible(false);
    setTimeLeft(ROUND_SECONDS);
    setScore(0);
    navigation?.navigate?.('Home');
  }, [navigation, stopAll]);

  const titleSize = isTiny ? 12 : isSmall ? 13 : 14;
  const mainBtnH = isTiny ? 44 : isSmall ? 48 : 54;
  const mainBtnR = isTiny ? 14 : isSmall ? 16 : 20;
  const startBtnR = isTiny ? 14 : isSmall ? 16 : 20;

  const hudFontV = isTiny ? 13 : isSmall ? 14 : 16;
  const hudPadV = isTiny ? 7 : isSmall ? 8 : 10;
  const hudRadius = isTiny ? 14 : 16;

  const dragonScale = pop.interpolate({ inputRange: [0, 1], outputRange: [0.62, 1] });
  const dragonOpacity = pop.interpolate({ inputRange: [0, 1], outputRange: [0.0, 1] });

  const reactMs = reactionMsForRound(round);

  const badgeSource = useMemo(() => {
    const idx = (round - 1) % 5;
    switch (idx) {
      case 0:
        return BADGE_1;
      case 1:
        return BADGE_2;
      case 2:
        return BADGE_3;
      case 3:
        return BADGE_4;
      default:
        return BADGE_5;
    }
  }, [round]);

  const popupScale = popup.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] });
  const popupOpacity = popup.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.topBar, { paddingTop: topSafe, paddingBottom: isTiny ? 2 : 4 }]}>
          <Pressable onPress={() => navigation?.goBack?.()} style={styles.backBtn} hitSlop={10}>
            <Image source={ICON_BACK} style={styles.backIcon} />
          </Pressable>

          <Text style={[styles.topTitle, { fontSize: titleSize }]}>CATCH RUSH</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={{ height: topToHudGap }} />
        <View style={[styles.centerWrap, { paddingHorizontal: padH, paddingBottom: bottomPad }]}>
          <View style={[styles.hudRow, { gap: isTiny ? 6 : 8 }]}>
            <View style={[styles.hudPill, { paddingVertical: hudPadV, borderRadius: hudRadius }]}>
              <Text style={[styles.hudLabel, { fontSize: isTiny ? 10 : 11 }]}>ROUND</Text>
              <Text style={[styles.hudValue, { fontSize: hudFontV }]}>
                {round}/{TOTAL_ROUNDS}
              </Text>
            </View>

            <View style={[styles.hudPill, { paddingVertical: hudPadV, borderRadius: hudRadius }]}>
              <Text style={[styles.hudLabel, { fontSize: isTiny ? 10 : 11 }]}>TIME</Text>
              <Text style={[styles.hudValue, { fontSize: hudFontV }]}>
                {phase === 'round' ? `${timeLeft}s` : `${ROUND_SECONDS}s`}
              </Text>
            </View>

            <View style={[styles.hudPill, { paddingVertical: hudPadV, borderRadius: hudRadius }]}>
              <Text style={[styles.hudLabel, { fontSize: isTiny ? 10 : 11 }]}>SCORE</Text>
              <Text style={[styles.hudValue, { fontSize: hudFontV }]}>
                {phase === 'round' ? score : 0}
              </Text>
            </View>
          </View>

          <View style={{ height: hudToFieldGap }} />
          <View
            style={[
              styles.playField,
              {
                width: playW,
                height: playH,
                borderRadius: isTiny ? 16 : isSmall ? 18 : 22,
              },
            ]}
          >
            {phase === 'idle' && (
              <View style={styles.idleOverlay} pointerEvents="none">
                <Text style={[styles.idleText, { fontSize: isTiny ? 12 : 13 }]}>
                  Press START to begin
                </Text>
              </View>
            )}

            {visible && phase === 'round' && (
              <Animated.View
                style={[
                  styles.dragonWrap,
                  {
                    width: dragonSize,
                    height: dragonSize,
                    left: pos.x,
                    top: pos.y,
                    opacity: dragonOpacity,
                    transform: [{ scale: dragonScale }],
                  },
                ]}
              >
                <Pressable
                  onPress={onTapDragon}
                  hitSlop={tapSlop}
                  pressRetentionOffset={{ top: 24, bottom: 24, left: 24, right: 24 }}
                  android_ripple={{ color: 'rgba(0,0,0,0.10)', borderless: true }}
                  style={[styles.dragonBtn, { padding: extraTouchPad }]}
                >
                  <Image source={DRAGON} style={styles.dragonImg} resizeMode="contain" />
                </Pressable>
              </Animated.View>
            )}
          </View>

          <View style={{ height: isTiny ? 10 : 12 }} />
          {phase === 'idle' && (
            <Pressable
              style={[styles.startBtn, { height: startBtnH, borderRadius: startBtnR, width: playW }]}
              onPress={onPressStart}
            >
              <Text style={styles.startBtnText}>START</Text>
            </Pressable>
          )}

          <View style={{ height: isTiny ? 6 : 8 }} />
          <Text style={[styles.hint, { fontSize: isTiny ? 10.5 : 12 }]}>Reaction window: {reactMs}ms</Text>
          <Text style={[styles.hint, { marginTop: 3, fontSize: isTiny ? 10.5 : 12 }]}>
            Pass: {needed}+ taps in 20s
          </Text>
        </View>

        <FireFlicker />
        <View style={{ height: bottomPad }} />

        {phase === 'result' && (
          <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            <Pressable style={styles.dim} onPress={onRetry} />

            <View style={styles.modalCenter} pointerEvents="box-none">
              <Animated.View
                style={[
                  styles.resultCard,
                  {
                    width: playW,
                    borderRadius: isTiny ? 20 : isSmall ? 22 : 26,
                    padding: isTiny ? 14 : isSmall ? 16 : 20,
                    opacity: popupOpacity,
                    transform: [{ scale: popupScale }],
                  },
                ]}
              >
                <Text style={[styles.resultTitle, { fontSize: isTiny ? 18 : isSmall ? 20 : 22 }]}>
                  {passed ? 'ROUND COMPLETE' : 'ROUND FAILED'}
                </Text>

                {passed && (
                  <View style={[styles.singleBadgeWrap, { marginTop: isTiny ? 8 : 10 }]}>
                    <Image source={badgeSource} style={styles.singleBadgeImg} resizeMode="contain" />
                  </View>
                )}

                <Text style={[styles.resultScore, { fontSize: isTiny ? 13.5 : 15, marginTop: 8 }]}>
                  Taps: {score}
                </Text>

                <Text style={[styles.resultHint, { marginTop: 6 }]}>
                  {passed
                    ? round >= TOTAL_ROUNDS
                      ? 'All rounds finished.'
                      : 'Next round is ready.'
                    : `Need ${needed}+ to pass.`}
                </Text>

                <View style={{ height: isTiny ? 12 : 14 }} />

                {passed ? (
                  <Pressable style={[styles.mainBtn, { height: mainBtnH, borderRadius: mainBtnR }]} onPress={onNextRound}>
                    <Text style={styles.mainBtnText}>{round >= TOTAL_ROUNDS ? 'FINISH' : 'NEXT ROUND'}</Text>
                  </Pressable>
                ) : (
                  <Pressable style={[styles.mainBtn, { height: mainBtnH, borderRadius: mainBtnR }]} onPress={onRetry}>
                    <Text style={styles.mainBtnText}>TRY AGAIN</Text>
                  </Pressable>
                )}

                <View style={{ height: isTiny ? 8 : 10 }} />

                <Pressable style={[styles.menuBtn, { height: mainBtnH, borderRadius: mainBtnR }]} onPress={onMenu}>
                  <Text style={styles.menuBtnText}>MENU</Text>
                </Pressable>

                <Text style={[styles.levelLine, { marginTop: isTiny ? 10 : 12 }]}>
                  Round {round}/{TOTAL_ROUNDS} • Total taps {hitsTotal}
                </Text>
              </Animated.View>
            </View>
          </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topTitle: {
    color: 'rgba(255,255,255,0.92)',
    fontWeight: '900',
    letterSpacing: 1,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    tintColor: '#fff',
  },

  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hudRow: {
    width: '100%',
    maxWidth: 460,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  hudPill: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
  },
  hudLabel: { color: 'rgba(255,255,255,0.70)', fontWeight: '800' },
  hudValue: { color: '#fff', fontWeight: '900', marginTop: 1 },

  playField: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,180,94,0.55)',
    overflow: 'hidden',
    position: 'relative',
  },

  idleOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  idleText: {
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '900',
  },

  dragonWrap: { position: 'absolute' },
  dragonBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragonImg: {
    width: '100%',
    height: '100%',
  },

  startBtn: {
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 18,
  },
  startBtnText: {
    color: '#0b0b0b',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.6,
  },

  hint: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '800',
    paddingHorizontal: 10,
  },

  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalCenter: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },

  resultCard: {
    backgroundColor: 'rgba(110,12,12,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  resultTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  resultScore: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  resultHint: {
    color: 'rgba(255,255,255,0.84)',
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 18,
  },

  singleBadgeWrap: { alignItems: 'center', justifyContent: 'center' },
  singleBadgeImg: { width: 54, height: 54 },

  mainBtn: {
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 18,
    minWidth: 220,
  },
  mainBtnText: {
    color: '#0b0b0b',
    fontWeight: '900',
    fontSize: 14,
    letterSpacing: 0.4,
  },

  menuBtn: {
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderWidth: 2,
    borderColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 18,
    minWidth: 220,
  },
  menuBtnText: { color: '#fff', fontWeight: '900', fontSize: 14, letterSpacing: 0.4 },

  levelLine: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '800',
    fontSize: 12,
  },

  fireWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: -6,
  },
  fireImg: {
    width: '100%',
    height: '100%',
  },
});
