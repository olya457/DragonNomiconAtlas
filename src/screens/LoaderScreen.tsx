import React, { useEffect, useMemo } from 'react';
import { View, StyleSheet, ImageBackground, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Loader'>;
const BG = require('../assets/background.png');

export default function LoaderScreen({ navigation }: Props) {
  const { width } = useWindowDimensions();
  const boxSize = Math.min(Math.round(width * 0.62), 280);

  useEffect(() => {
    const t = setTimeout(() => navigation.replace('Onboard'), 3000);
    return () => clearTimeout(t);
  }, [navigation]);
  const html = useMemo(() => FIRE_HTML, []);

  return (
    <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={[styles.fireBox, { width: boxSize, height: boxSize }]}>
          <WebView
            originWhitelist={['*']}
            source={{ html }}
            style={styles.web}
            scrollEnabled={false}
            javaScriptEnabled
            automaticallyAdjustContentInsets={false}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const FIRE_HTML = `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
<style>
html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: transparent;
}

.stage {
  position: relative;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 50% 55%,
    rgba(255, 170, 70, 0.22),
    rgba(255, 60, 0, 0.10),
    rgba(0, 0, 0, 0));
}

.flash {
  position: absolute;
  left: 50%;
  top: 55%;
  width: 70%;
  height: 70%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  background: radial-gradient(circle,
    rgba(255, 230, 170, 0.95),
    rgba(255, 150, 40, 0.65),
    rgba(255, 40, 0, 0.20),
    transparent 70%);
  filter: blur(10px);
  animation: pulse 1.35s ease-in-out infinite;
  opacity: 0.9;
}

.flash.f2 { animation-delay: 0.35s; transform: translate(-50%, -50%) scale(0.86); opacity: 0.85; }
.flash.f3 { animation-delay: 0.70s; transform: translate(-50%, -50%) scale(0.72); opacity: 0.8; }

.spark {
  position: absolute;
  left: 50%;
  top: 55%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 210, 130, 0.95);
  filter: blur(0.5px);
  transform: translate(-50%, -50%);
  animation: rise 1.2s linear infinite;
  opacity: 0;
}

.spark.s2 { animation-delay: 0.25s; }
.spark.s3 { animation-delay: 0.5s; }
.spark.s4 { animation-delay: 0.75s; }

@keyframes pulse {
  0%   { transform: translate(-50%, -50%) scale(0.55); opacity: 0.18; }
  45%  { transform: translate(-50%, -50%) scale(1.05); opacity: 1; }
  100% { transform: translate(-50%, -50%) scale(0.55); opacity: 0.18; }
}

@keyframes rise {
  0%   { opacity: 0; transform: translate(-50%, -50%) translate(0px, 10px) scale(0.8); }
  15%  { opacity: 1; }
  100% { opacity: 0; transform: translate(-50%, -50%) translate(0px, -120px) scale(0.2); }
}
</style>
</head>
<body>
  <div class="stage">
    <div class="flash f1"></div>
    <div class="flash f2"></div>
    <div class="flash f3"></div>

    <div class="spark s1"></div>
    <div class="spark s2"></div>
    <div class="spark s3"></div>
    <div class="spark s4"></div>
  </div>
</body>
</html>
`;

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  safe: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fireBox: {
    borderRadius: 26,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  web: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
