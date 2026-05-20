# 막탄 맛집 가이드

세부여행플래너 블로그의 막탄 맛집·카페 지도를 **React Native (Expo)** 모바일 앱으로 옮긴 프로젝트입니다.

## 주요 기능

- **지도**: OpenStreetMap(Leaflet) — 세부 가볼만한곳과 동일 방식, Expo Go에서도 동작
- **마커 탭**: 하단 Bottom Sheet에 식당 정보 + 블로그 링크
- **카테고리 필터**: 전체 / 한식 / 씨푸드 / 일식 / 카페&디저트 / 로컬음식 / 기타
- **목록**: 가볼만한곳과 같이 지도 아래 아코디언 목록 (펼치면 지도 이동 + 블로그 링크)
- **검색**: 식당명·설명 키워드 검색
- **오프라인 목록**: `src/data/restaurants.json` 로컬 데이터 (목록·필터·검색은 네트워크 없이 동작)

## 기술 스택

- Expo SDK 52 + TypeScript
- react-native-webview (지도 Leaflet + 네이버 블로그 인앱)
- @gorhom/bottom-sheet
- @react-navigation/native

## 사전 준비

1. [Node.js](https://nodejs.org/) 18+
2. (실기기 테스트) [Expo Go](https://expo.dev/go) — 지도는 인터넷 연결 필요(OSM 타일 로드)

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

터미널에서 `a`(Android) / `i`(iOS) / QR 코드(Expo Go)로 실행합니다.

> **지도 참고**: Expo Go에서는 Google Maps 네이티브 SDK가 제한되어 **OpenStreetMap(Leaflet)** 으로 표시합니다. 세부 가볼만한곳 앱과 같은 방식입니다.

## 프로젝트 구조

```
src/
  components/     # SearchBar, FilterBar, RestaurantCard, BottomSheet 등
  screens/        # HomeScreen, MapScreen, ListScreen, BlogWebViewScreen
  data/           # restaurants.json (53곳)
  constants/      # 테마, 카테고리
  navigation/     # 스택 네비게이션
  utils/          # 필터·링크 헬퍼
```

## 데이터 수정

`src/data/restaurants.json`을 편집한 뒤 앱을 새로고침하면 반영됩니다.  
각 항목의 `category` 값: `korean` | `seafood` | `japanese` | `cafe` | `local` | `other`

## 라이선스

개인·블로그 연동 프로젝트용입니다.
