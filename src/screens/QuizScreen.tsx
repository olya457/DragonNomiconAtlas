import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  Image,
  useWindowDimensions,
  Platform,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const BG = require('../assets/background.png');
const BG2 = require('../assets/background2.png');
const ICON_BACK = require('../assets/back.png');
const FIRE = require('../assets/flames.png');

type Choice = { id: 'A' | 'B' | 'C'; text: string };
type Question = { id: string; text: string; choices: Choice[]; correct: Choice['id'] };

const LEVELS_TOTAL = 10;
const QUESTIONS_PER_LEVEL = 10;
const PASS_THRESHOLD = 7;

const STORAGE_BEST = 'quiz_best_v2';
const STORAGE_LEVEL = 'quiz_level_v2';

const QUESTION_BANK: Question[] = [
  {
    id: 'q1',
    text: 'In which country is Uluru located?',
    choices: [
      { id: 'A', text: 'A) New Zealand' },
      { id: 'B', text: 'B) South Africa' },
      { id: 'C', text: 'C) Australia' },
    ],
    correct: 'C',
  },
  {
    id: 'q2',
    text: 'What gives Peyto Lake its turquoise color?',
    choices: [
      { id: 'A', text: 'A) Algae' },
      { id: 'B', text: 'B) Glacial dust' },
      { id: 'C', text: 'C) Volcanic ash' },
    ],
    correct: 'B',
  },
  {
    id: 'q3',
    text: 'The Twelve Apostles were formed by:',
    choices: [
      { id: 'A', text: 'A) Volcanic activity' },
      { id: 'B', text: 'B) Ocean erosion' },
      { id: 'C', text: 'C) Earthquakes' },
    ],
    correct: 'B',
  },
  {
    id: 'q4',
    text: 'The Daintree Rainforest is known for being:',
    choices: [
      { id: 'A', text: 'A) The youngest rainforest' },
      { id: 'B', text: 'B) Older than the Amazon' },
      { id: 'C', text: 'C) Completely artificial' },
    ],
    correct: 'B',
  },
  {
    id: 'q5',
    text: 'In which country is the Athabasca Glacier located?',
    choices: [
      { id: 'A', text: 'A) Iceland' },
      { id: 'B', text: 'B) Canada' },
      { id: 'C', text: 'C) Norway' },
    ],
    correct: 'B',
  },
  {
    id: 'q6',
    text: 'The Bungle Bungle Range is known for:',
    choices: [
      { id: 'A', text: 'A) Ice caves' },
      { id: 'B', text: 'B) Dome-shaped banded formations' },
      { id: 'C', text: 'C) Active volcanoes' },
    ],
    correct: 'B',
  },
  {
    id: 'q7',
    text: 'The Hopewell Rocks change their appearance due to:',
    choices: [
      { id: 'A', text: 'A) Strong winds' },
      { id: 'B', text: 'B) Frequent earthquakes' },
      { id: 'C', text: 'C) Ebb and flow of tides' },
    ],
    correct: 'C',
  },
  {
    id: 'q8',
    text: 'What natural phenomenon creates Horizontal Falls?',
    choices: [
      { id: 'A', text: 'A) Waterfall from a height' },
      { id: 'B', text: 'B) Tidal flows between rocks' },
      { id: 'C', text: 'C) Melting glaciers' },
    ],
    correct: 'B',
  },
  {
    id: 'q9',
    text: 'Icefield Columbia feeds:',
    choices: [
      { id: 'A', text: 'A) Sandy deserts' },
      { id: 'B', text: 'B) Ocean currents' },
      { id: 'C', text: 'C) River systems' },
    ],
    correct: 'C',
  },
  {
    id: 'q10',
    text: 'Lake Hillier is known for:',
    choices: [
      { id: 'A', text: 'A) Round shape' },
      { id: 'B', text: 'B) Pink color of water' },
      { id: 'C', text: 'C) Hot temperature' },
    ],
    correct: 'B',
  },
  {
    id: 'q11',
    text: 'Kings Canyon is known for:',
    choices: [
      { id: 'A', text: 'A) Sand dunes' },
      { id: 'B', text: 'B) Deep red walls' },
      { id: 'C', text: 'C) Ice cracks' },
    ],
    correct: 'B',
  },
  {
    id: 'q12',
    text: 'Blue Mountains got their name from:',
    choices: [
      { id: 'A', text: 'A) Color of rocks' },
      { id: 'B', text: 'B) Mist from eucalyptus trees' },
      { id: 'C', text: 'C) Proximity to the ocean' },
    ],
    correct: 'B',
  },
  {
    id: 'q13',
    text: 'Ningaloo Reef is located:',
    choices: [
      { id: 'A', text: 'A) Far from the coast' },
      { id: 'B', text: 'B) Near the coast' },
      { id: 'C', text: 'C) Under the ice' },
    ],
    correct: 'B',
  },
  {
    id: 'q14',
    text: 'Gros Morne Tablelands are unique in that they have:',
    choices: [
      { id: 'A', text: 'A) Volcanic craters' },
      { id: 'B', text: 'B) Mantle rocks' },
      { id: 'C', text: 'C) Coral reefs' },
    ],
    correct: 'B',
  },
  {
    id: 'q15',
    text: 'Spirit Island is located:',
    choices: [
      { id: 'A', text: 'A) In a desert' },
      { id: 'B', text: 'B) On a river' },
      { id: 'C', text: 'C) On a glacial lake' },
    ],
    correct: 'C',
  },
  {
    id: 'q16',
    text: 'Simpson Desert is known for:',
    choices: [
      { id: 'A', text: 'A) Stone plateaus' },
      { id: 'B', text: 'B) Parallel dunes' },
      { id: 'C', text: 'C) Rainforests' },
    ],
    correct: 'B',
  },
  {
    id: 'q17',
    text: 'Mount Assiniboine is often compared to:',
    choices: [
      { id: 'A', text: 'A) Mount Fuji' },
      { id: 'B', text: 'B) Matterhorn' },
      { id: 'C', text: 'C) Mount Kilimanjaro' },
    ],
    correct: 'B',
  },
  {
    id: 'q18',
    text: 'Karlu Karlu consists of:',
    choices: [
      { id: 'A', text: 'A) Sharp cliffs' },
      { id: 'B', text: 'B) Sand hills' },
      { id: 'C', text: 'C) Rounded boulders' },
    ],
    correct: 'C',
  },
  {
    id: 'q19',
    text: 'Haida Gwaii is:',
    choices: [
      { id: 'A', text: 'A) Mountain range' },
      { id: 'B', text: 'B) Archipelago' },
      { id: 'C', text: 'C) Lake' },
    ],
    correct: 'B',
  },
  {
    id: 'q20',
    text: 'Stonehammer Geopark showcases:',
    choices: [
      { id: 'A', text: 'A) Modern architecture' },
      { id: 'B', text: 'B) Geological history of the region' },
      { id: 'C', text: 'C) Active volcanoes' },
    ],
    correct: 'B',
  },
];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickQuestions(bank: Question[]): Question[] {
  return shuffle(bank).slice(0, QUESTIONS_PER_LEVEL);
}

type Phase = 'intro' | 'question' | 'result';

function FireFlickerBar() {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();
  const isSmall = H <= 740 || W <= 370;
  const isTiny = H <= 690 || W <= 350;

  const flick = useRef(new Animated.Value(0)).current;
  const drift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const flickLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flick, {
          toValue: 1,
          duration: 420,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(flick, {
          toValue: 0,
          duration: 420,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    const driftLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(drift, {
          toValue: 0,
          duration: 900,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ])
    );

    flickLoop.start();
    driftLoop.start();

    return () => {
      flickLoop.stop();
      driftLoop.stop();
    };
  }, [drift, flick]);

  const opacity = flick.interpolate({
    inputRange: [0, 1],
    outputRange: [0.40, 0.62],
  });

  const scale = drift.interpolate({
    inputRange: [0, 1],
    outputRange: [1.0, 1.04],
  });

  const imgW = W * 1.35;
  const imgH = isTiny ? 210 : isSmall ? 240 : 285;

  const bottom = Math.max(-10, -6 + (Platform.OS === 'ios' ? insets.bottom * 0.35 : 0));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.fireAbs,
        {
          bottom,
          opacity,
          transform: [{ scale }],
        },
      ]}
    >
      <Image source={FIRE} style={{ width: imgW, height: imgH }} resizeMode="cover" />
    </Animated.View>
  );
}

export default function QuizScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { width: W, height: H } = useWindowDimensions();
  const isSmall = H <= 740 || W <= 370;
  const isTiny = H <= 690 || W <= 350;

  const [phase, setPhase] = useState<Phase>('intro');
  const [level, setLevel] = useState(1);
  const [best, setBest] = useState(1);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);

  const [locked, setLocked] = useState(false);
  const [selected, setSelected] = useState<Choice['id'] | null>(null);

  const tRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const appearQ = useRef(new Animated.Value(0)).current;
  const appearA = useRef(new Animated.Value(0)).current;

  const current = questions[idx];

  const runQuestionAnim = useCallback(() => {
    appearQ.setValue(0);
    appearA.setValue(0);

    Animated.sequence([
      Animated.timing(appearQ, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(appearA, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [appearA, appearQ]);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        const rawLevel = await AsyncStorage.getItem(STORAGE_LEVEL);
        const rawBest = await AsyncStorage.getItem(STORAGE_BEST);

        const lv = rawLevel ? Number(rawLevel) : 1;
        const bs = rawBest ? Number(rawBest) : 1;

        setLevel(isFinite(lv) && lv >= 1 ? Math.min(lv, LEVELS_TOTAL) : 1);
        setBest(isFinite(bs) && bs >= 1 ? Math.min(bs, LEVELS_TOTAL) : 1);
      })();

      return () => {
        if (tRef.current) clearTimeout(tRef.current);
        tRef.current = null;

        setPhase('intro');
        setQuestions([]);
        setIdx(0);
        setScore(0);
        setSelected(null);
        setLocked(false);
        appearQ.setValue(0);
        appearA.setValue(0);
      };
    }, [appearA, appearQ])
  );

  const startLevel = useCallback(
    async (lv: number) => {
      if (tRef.current) clearTimeout(tRef.current);

      const safeLv = Math.max(1, Math.min(lv, LEVELS_TOTAL));
      setLevel(safeLv);

      setQuestions(pickQuestions(QUESTION_BANK));
      setIdx(0);
      setScore(0);
      setSelected(null);
      setLocked(false);
      setPhase('question');

      await AsyncStorage.setItem(STORAGE_LEVEL, String(safeLv));
      requestAnimationFrame(() => runQuestionAnim());
    },
    [runQuestionAnim]
  );

  const toMenu = useCallback(() => {
    if (tRef.current) clearTimeout(tRef.current);
    tRef.current = null;
    setPhase('intro');
    setSelected(null);
    setLocked(false);
  }, []);

  const passed = score >= PASS_THRESHOLD;

  const onChoose = useCallback(
    (choiceId: Choice['id']) => {
      if (!current) return;
      if (locked) return;

      setLocked(true);
      setSelected(choiceId);

      const correct = current.correct === choiceId;
      if (correct) setScore(s => s + 1);

      if (tRef.current) clearTimeout(tRef.current);
      tRef.current = setTimeout(() => {
        const isLast = idx >= QUESTIONS_PER_LEVEL - 1;

        setSelected(null);
        setLocked(false);

        if (isLast) {
          setPhase('result');
        } else {
          setIdx(i => i + 1);
          runQuestionAnim();
        }
      }, 620);
    },
    [current, locked, idx, runQuestionAnim]
  );

  const onNextRound = useCallback(async () => {
    const nextLevel = Math.min(level + 1, LEVELS_TOTAL);

    const nextBest = Math.max(best, nextLevel);
    if (nextBest !== best) {
      setBest(nextBest);
      await AsyncStorage.setItem(STORAGE_BEST, String(nextBest));
    }

    if (level >= LEVELS_TOTAL) {
      setPhase('intro');
      return;
    }

    startLevel(nextLevel);
  }, [best, level, startLevel]);

  const onRetry = useCallback(() => startLevel(level), [level, startLevel]);
  const padH = isTiny ? 14 : isSmall ? 16 : 20;

  const topTitleSize = isTiny ? 12.5 : isSmall ? 13 : 14;

  const qTextSize = isTiny ? 14 : isSmall ? 15 : 17;
  const qLine = isTiny ? 20 : isSmall ? 22 : 26;

  const btnH = isTiny ? 42 : isSmall ? 46 : 52;
  const btnR = isTiny ? 14 : isSmall ? 16 : 20;

  const cardR = isTiny ? 20 : isSmall ? 22 : 26;
  const cardPad = isTiny ? 14 : isSmall ? 16 : 20;

  const gridGap = isTiny ? 8 : 10;
  const cellSize = isTiny ? 38 : isSmall ? 42 : 44;
  const cellRadius = isTiny ? 14 : 16;

  const mainMinW = isTiny ? 200 : isSmall ? 210 : 220;

  const progress = useMemo(() => `${idx + 1}/${QUESTIONS_PER_LEVEL}`, [idx]);
  if (phase === 'intro') {
    return (
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={[styles.topBar, { paddingTop: Math.max(8, insets.top ? 6 : 8) }]}>
            <Pressable onPress={() => navigation?.goBack?.()} style={styles.backBtn} hitSlop={10}>
              <Image source={ICON_BACK} style={styles.backIcon} />
            </Pressable>
            <Text style={[styles.topTitle, { fontSize: topTitleSize }]}>QUIZ</Text>
            <View style={{ width: 40 }} />
          </View>

          <View style={[styles.center, { paddingHorizontal: padH }]}>
            <Text style={[styles.menuTitle, { fontSize: isTiny ? 18 : isSmall ? 20 : 24 }]}>
              QUIZ
            </Text>

            <Text
              style={[
                styles.menuSub,
                {
                  fontSize: isTiny ? 12 : isSmall ? 12.5 : 13.5,
                  lineHeight: isTiny ? 17 : isSmall ? 18 : 20,
                  paddingHorizontal: isTiny ? 4 : 10,
                },
              ]}
            >
              10 questions per round. Pass if you get {PASS_THRESHOLD}+ correct.
            </Text>

            <View style={{ height: isTiny ? 10 : 14 }} />

            <View style={[styles.infoRow, { gap: isTiny ? 8 : 10 }]}>
              <View style={[styles.infoPill, { minWidth: isTiny ? 84 : 92, paddingVertical: isTiny ? 8 : 10 }]}>
                <Text style={[styles.infoLabel, { fontSize: isTiny ? 10 : 11 }]}>Level</Text>
                <Text style={[styles.infoValue, { fontSize: isTiny ? 13 : 14 }]}>
                  {level}/{LEVELS_TOTAL}
                </Text>
              </View>
              <View style={[styles.infoPill, { minWidth: isTiny ? 84 : 92, paddingVertical: isTiny ? 8 : 10 }]}>
                <Text style={[styles.infoLabel, { fontSize: isTiny ? 10 : 11 }]}>Unlocked</Text>
                <Text style={[styles.infoValue, { fontSize: isTiny ? 13 : 14 }]}>
                  {best}/{LEVELS_TOTAL}
                </Text>
              </View>
              <View style={[styles.infoPill, { minWidth: isTiny ? 84 : 92, paddingVertical: isTiny ? 8 : 10 }]}>
                <Text style={[styles.infoLabel, { fontSize: isTiny ? 10 : 11 }]}>Questions</Text>
                <Text style={[styles.infoValue, { fontSize: isTiny ? 13 : 14 }]}>{QUESTIONS_PER_LEVEL}</Text>
              </View>
            </View>

            <View style={{ height: isTiny ? 12 : 18 }} />

            <View style={[styles.levelGrid, { gap: gridGap }]}>
              {Array.from({ length: LEVELS_TOTAL }).map((_, i) => {
                const lv = i + 1;
                const unlocked = lv <= best;
                const activeLv = lv === level;

                return (
                  <Pressable
                    key={lv}
                    onPress={() => unlocked && startLevel(lv)}
                    style={[
                      styles.levelCell,
                      {
                        width: cellSize,
                        height: cellSize,
                        borderRadius: cellRadius,
                      },
                      activeLv && styles.levelCellActive,
                      !unlocked && styles.levelCellLocked,
                    ]}
                  >
                    <Text style={[styles.levelText, { fontSize: isTiny ? 13 : 14 }, !unlocked && styles.levelTextLocked]}>
                      {lv}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={{ height: isTiny ? 12 : 18 }} />

            <Pressable
              style={[
                styles.mainBtn,
                { height: btnH, borderRadius: btnR, minWidth: mainMinW },
              ]}
              onPress={() => startLevel(level)}
            >
              <Text style={[styles.mainBtnText, { fontSize: isTiny ? 13 : 14 }]}>START</Text>
            </Pressable>

            <View style={{ height: Math.max(16, insets.bottom + 10) }} />
          </View>

          <FireFlickerBar />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  if (phase === 'result') {
    return (
      <ImageBackground source={BG2} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
          <View style={{ height: Math.max(8, insets.top ? 6 : 8) }} />

          <View style={[styles.resultCenter, { paddingHorizontal: padH }]}>
            <View style={[styles.resultCard, { borderRadius: cardR, padding: cardPad }]}>
              <Text style={[styles.resultTitle, { fontSize: isTiny ? 16 : isSmall ? 18 : 22 }]}>
                {passed ? 'ROUND COMPLETE' : 'ROUND FAILED'}
              </Text>

              <Text style={[styles.resultScore, { fontSize: isTiny ? 13 : 15, marginTop: 10 }]}>
                Correct answers: {score}/{QUESTIONS_PER_LEVEL}
              </Text>

              <Text
                style={[
                  styles.resultHint,
                  {
                    fontSize: isTiny ? 12 : 13,
                    lineHeight: isTiny ? 17 : 19,
                    marginTop: 8,
                  },
                ]}
              >
                {passed
                  ? `You passed. Next round is available.`
                  : `You need at least ${PASS_THRESHOLD} correct to pass.`}
              </Text>

              <View style={{ height: 14 }} />

              {passed ? (
                <Pressable
                  style={[styles.mainBtn, { height: btnH, borderRadius: btnR, minWidth: mainMinW }]}
                  onPress={onNextRound}
                >
                  <Text style={[styles.mainBtnText, { fontSize: isTiny ? 13 : 14 }]}>
                    {level >= LEVELS_TOTAL ? 'FINISH' : 'NEXT ROUND'}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  style={[styles.mainBtn, { height: btnH, borderRadius: btnR, minWidth: mainMinW }]}
                  onPress={onRetry}
                >
                  <Text style={[styles.mainBtnText, { fontSize: isTiny ? 13 : 14 }]}>PLAY AGAIN</Text>
                </Pressable>
              )}

              <View style={{ height: 10 }} />

              <Pressable
                style={[styles.menuBtn, { height: btnH, borderRadius: btnR, minWidth: mainMinW }]}
                onPress={toMenu}
              >
                <Text style={[styles.menuBtnText, { fontSize: isTiny ? 13 : 14 }]}>MENU</Text>
              </Pressable>

              <Text style={[styles.levelLine, { marginTop: isTiny ? 10 : 12 }]}>
                Level {level} • Best {best}/{LEVELS_TOTAL}
              </Text>
            </View>
          </View>

          <View style={{ height: Math.max(16, insets.bottom + 10) }} />

          <FireFlickerBar />
        </SafeAreaView>
      </ImageBackground>
    );
  }

  const qTranslate = appearQ.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  const aTranslate = appearA.interpolate({ inputRange: [0, 1], outputRange: [14, 0] });

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.topBar, { paddingTop: Math.max(8, insets.top ? 6 : 8) }]}>
          <Pressable onPress={toMenu} style={styles.backBtn} hitSlop={10}>
            <Image source={ICON_BACK} style={styles.backIcon} />
          </Pressable>

          <Text style={[styles.topTitle, { fontSize: topTitleSize }]}>{progress}</Text>

          <View style={{ width: 40 }} />
        </View>

        <View style={[styles.qCenterWrap, { paddingHorizontal: padH }]}>
          <Animated.View style={{ opacity: appearQ, transform: [{ translateY: qTranslate }] }}>
            <Text style={[styles.qText, { fontSize: qTextSize, lineHeight: qLine }]}>
              {current?.text}
            </Text>
          </Animated.View>

          <View style={{ height: isTiny ? 14 : 18 }} />

          <Animated.View style={{ opacity: appearA, transform: [{ translateY: aTranslate }], width: '100%' }}>
            {current?.choices.map(c => {
              const picked = selected === c.id;
              const correct = c.id === current.correct;

              const base: any[] = [
                styles.answerBtn,
                {
                  height: btnH,
                  borderRadius: btnR,
                  maxWidth: isTiny ? 380 : 420,
                  marginBottom: isTiny ? 10 : 12,
                },
              ];

              if (locked && correct) base.push(styles.answerCorrect);
              if (locked && picked && !correct) base.push(styles.answerWrong);

              return (
                <Pressable
                  key={c.id}
                  style={base}
                  onPress={() => onChoose(c.id)}
                  disabled={locked}
                >
                  <Text style={[styles.answerText, { fontSize: isTiny ? 13 : 14.2 }]}>
                    {c.text}
                  </Text>
                </Pressable>
              );
            })}
          </Animated.View>

          <View style={{ height: 10 }} />

          <Text style={[styles.helperLine, { fontSize: isTiny ? 11.2 : 12 }]}>
            Score: {score}/{QUESTIONS_PER_LEVEL} • Need {PASS_THRESHOLD}
          </Text>
        </View>

        <View style={{ height: Math.max(16, insets.bottom + 10) }} />

        <FireFlickerBar />
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: { flex: 1 },
  safe: { flex: 1 },
  topBar: {
    paddingHorizontal: 14,
    paddingBottom: 6,
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

  center: { flex: 1, justifyContent: 'center' },
  menuTitle: { color: '#fff', fontWeight: '900', textAlign: 'center', marginBottom: 10 },
  menuSub: { color: 'rgba(255,255,255,0.84)', fontWeight: '700', textAlign: 'center' },

  infoRow: { flexDirection: 'row', justifyContent: 'center' },
  infoPill: {
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
  },
  infoLabel: { color: 'rgba(255,255,255,0.72)', fontWeight: '800' },
  infoValue: { color: '#fff', fontWeight: '900', marginTop: 2 },

  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  levelCell: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.16)',
    borderWidth: 2,
    borderColor: 'rgba(255,180,94,0.9)',
  },
  levelCellActive: { backgroundColor: '#6e0c0c' },
  levelCellLocked: { borderColor: 'rgba(255,255,255,0.14)', opacity: 0.6 },
  levelText: { color: '#fff', fontWeight: '900' },
  levelTextLocked: { color: 'rgba(255,255,255,0.7)' },

  mainBtn: {
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 18,
  },
  mainBtnText: {
    color: '#0b0b0b',
    fontWeight: '900',
    letterSpacing: 0.4,
  },
  qCenterWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 4,
  },
  qText: {
    color: 'rgba(255,255,255,0.94)',
    fontWeight: '900',
    textAlign: 'center',
    paddingHorizontal: 6,
  },

  answerBtn: {
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  answerWrong: { backgroundColor: '#FF1A1A' },
  answerCorrect: { backgroundColor: '#39E75F' },
  answerText: { color: '#0b0b0b', fontWeight: '900', textAlign: 'center' },

  helperLine: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.78)',
    fontWeight: '800',
    ...Platform.select({ android: { paddingBottom: 1 } }),
  },
  resultCenter: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  resultCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(110,12,12,0.92)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  resultTitle: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  resultScore: { color: '#fff', fontWeight: '900', textAlign: 'center' },
  resultHint: { color: 'rgba(255,255,255,0.84)', fontWeight: '700', textAlign: 'center' },

  menuBtn: {
    backgroundColor: 'rgba(0,0,0,0.20)',
    borderWidth: 2,
    borderColor: '#FFB45E',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 18,
  },
  menuBtnText: { color: '#fff', fontWeight: '900', letterSpacing: 0.4 },

  levelLine: {
    textAlign: 'center',
    color: 'rgba(255,255,255,0.72)',
    fontWeight: '800',
    fontSize: 12,
  },

  fireAbs: {
    position: 'absolute',
    left: -60,
    right: -60,
    alignItems: 'center',
  },
});
