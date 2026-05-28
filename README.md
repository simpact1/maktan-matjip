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

### 웹에서 화면 보기 (수정 작업할 때)

**가장 쉬운 방법:** 프로젝트 폴더에서 `웹미리보기-시작.bat` 을 **더블클릭**합니다.

- 검은 창(터미널)이 뜨면 **닫지 말고** 두세요. (닫으면 화면도 꺼집니다.)
- 약 10초~2분 뒤 브라우저에서 **http://localhost:8086** 이 열립니다.
- 안 열리면 주소창에 `http://localhost:8086` 을 직접 입력하세요.

**Cursor 터미널에서 할 때:**

```bash
npm install
npm run web
```

그다음 브라우저에서 http://localhost:8086

### 휴대폰(Expo Go)에서 보기

```bash
npm install
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

## 최종 저장 & 웹 배포 (초보자용 요약)

### 1) 소스 코드 저장 (Git)

```bash
cd "프로젝트폴더"
git add -A
git commit -m "막탄맛집 가이드 작업 저장"
```

GitHub에 올리려면: GitHub에서 새 저장소 만든 뒤 `git remote add origin ...` → `git push -u origin main`

### 2) 배포용 웹 파일 만들기 (빌드)

더블클릭: `웹배포용-빌드.bat`  
또는 터미널: `npm run build:web`  
→ `dist` 폴더가 생깁니다.

### 3) 인터넷에 올리기 (가장 쉬움: Netlify Drop)

1. https://app.netlify.com 가입/로그인  
2. Sites → **Deploy manually** 또는 **Drop**  
3. `dist` 폴더를 통째로 끌어다 놓기  
4. `https://xxxx.netlify.app` 주소를 다른 사람에게 공유

### 4) 수정 후 다시 배포

코드 수정 → `웹배포용-빌드.bat` 다시 실행 → 새 `dist`를 Netlify에 다시 드롭  
(GitHub 연동 시에는 push만 하면 자동 재배포)

자세한 단계는 채팅/가이드의 «배포» 절을 참고하세요.

## 라이선스

개인·블로그 연동 프로젝트용입니다.
