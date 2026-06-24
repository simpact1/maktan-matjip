require('dotenv').config();

module.exports = {
  expo: {
    name: '막탄 맛집 가이드',
    slug: 'mactan-matzip',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#e67e22',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.cebuplanner.mactanmatzip',
      config: {
        googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#e67e22',
      },
      package: 'com.cebuplanner.mactanmatzip',
      usesCleartextTraffic: true,
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        },
      },
    },
    plugins: ['expo-font'],
    web: {
      bundler: 'metro',
      /** Netlify/Vercel 등 정적 호스팅용 단일 페이지 빌드 */
      output: 'single',
      favicon: './assets/icon.png',
      template: './web/index.html',
    },
  },
};
