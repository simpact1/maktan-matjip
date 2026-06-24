import { useRef, useState } from 'react';
import { Animated, LayoutAnimation, Platform, Pressable, ScrollView, StyleSheet, Text, UIManager, View } from 'react-native';
import { colors, fonts } from '../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_ITEMS = [
  {
    q: '세부 막탄 맛집 추천은 어디인가요?',
    a: '레드크랩, 마리바고크랩, 씨푸드 점보7 등 알리망오 크랩 전문점과 모닝글로리, 마리바고 그릴, 카바나 레스토랑이 인기입니다. 픽업·드랍 서비스가 가능한 곳도 많아 리조트에서 편리하게 이동할 수 있습니다.',
  },
  {
    q: '세부 막탄에서 알리망오 크랩을 먹을 수 있는 곳은 어디인가요?',
    a: '레드크랩, 마리바고크랩, 씨푸드 점보7, 에이스크랩, 막탄크랩이 대표적입니다. 대부분 카카오톡으로 예약과 픽업·드랍 서비스 신청이 가능합니다.',
  },
  {
    q: '세부 막탄 맛집에서 픽업·드랍 서비스가 가능한 곳은 어디인가요?',
    a: '씨푸드 점보7, 레드크랩, 마리바고크랩, 에이스크랩, 막탄크랩, 카바나, 모닝글로리, 마리바고 그릴 등이 있습니다. 카카오톡 채널을 통해 사전 예약 시 신청할 수 있습니다.',
  },
  {
    q: '세부 막탄 오션뷰 레스토랑은 어디인가요?',
    a: '카바나(더마크 리조트 2층), 씨푸드 부코 씨사이드, 란타우 코르도바(수상 레스토랑), 파롤라 씨뷰 레스토랑, 마리나 씨뷰가 대표적입니다. 선셋 시간에 방문하면 더욱 로맨틱한 분위기를 즐길 수 있습니다.',
  },
  {
    q: '세부 막탄 한식당은 어디에 있나요?',
    a: '장수촌(백숙 전문), 황소막창, 멍석갈비, 명동24(24시간 운영), 고래식당, 청담제면소 등이 있습니다. 막탄 뉴타운과 제이파크/샹스 지역에 주로 몰려 있습니다.',
  },
  {
    q: '세부 막탄 리조트 다이닝 맛집은 어디인가요?',
    a: '카바나(더마크), 모닝글로리(샹그릴라 인근), 마리바고 그릴(블루워터 인근), 씨푸드 점보7, 막탄크랩이 인기입니다. 앱 내 리조트 다이닝 탭에서 리조트별 추천 맛집을 확인할 수 있습니다.',
  },
  {
    q: '세부 막탄 뷰 맛집은 어디인가요?',
    a: '카바나(오션뷰), 씨푸드 부코 씨사이드(선셋뷰), 란타우 코르도바(수상뷰), 마리나 씨뷰(요트클럽), 파롤라 씨뷰 레스토랑이 있습니다. 세부시티에서는 탑스힐의 탑오브세부, 텐 이자카야, 셀라돈이 최고의 야경 뷰를 자랑합니다.',
  },
  {
    q: '세부시티 맛집 추천은 어디인가요?',
    a: '하우스 오브 레촌(레촌 전문), 쿠야제이(로컬 필리핀 요리), 오이스터 베이(씨푸드), 뷔페 101(가성비 뷔페), 논끼 SM몰(일식), 칠리스(멕시칸)가 인기입니다.',
  },
  {
    q: '세부시티 뷔페 맛집은 어디인가요?',
    a: '마르코폴로 호텔 조식 뷔페, 세다 센트럴 블록 석식 뷔페, 래디슨블루 석식 뷔페, 바이킹(SM몰), 뷔페 101이 대표적인 세부시티 뷔페 맛집입니다.',
  },
  {
    q: '세부시티 탑스힐 맛집은 어디인가요?',
    a: '탑스힐에는 세부 최고의 야경을 즐길 수 있는 탑오브세부, 일식 이자카야 텐 이자카야, 정통 타이 레스토랑 셀라돈이 있습니다. 해질 무렵 방문하면 노을과 야경을 모두 감상할 수 있습니다.',
  },
  {
    q: 'SM몰 세부 맛집은 어디인가요?',
    a: 'SM시티 세부에는 칠리스(멕시칸), 논끼(일식), 보태쥬(일식), 바이킹(뷔페)이 있습니다. 쇼핑과 식사를 한 번에 즐길 수 있어 편리합니다.',
  },
  {
    q: '아얄라몰 세부 맛집은 어디인가요?',
    a: '아얄라몰에는 쿠야제이(로컬 필리핀 요리), 카사베르데(양식), 레오나, 제이코(도넛), 브리크(양식)가 있습니다. 세부시티 쇼핑의 중심지로 다양한 식당이 모여 있습니다.',
  },
  {
    q: '막탄 카페 추천은 어디인가요?',
    a: '막탄 카페로는 라온 스퀘어 카페(스파+카페), 숨카페(정원 인테리어), 니모카페(아기자기한 분위기), 만송이 장미 카페(LED 장미 정원 야경), 제이파크 카페 스노우(생망고 디저트)가 인기입니다.',
  },
  {
    q: '막탄 아이 동반 맛집은 어디인가요?',
    a: '아이 동반 가족에게는 엔젤스 피자, 추비추비(블랙페퍼 새우), 졸리비, 맥도날드, 망이나살(닭고기 구이)이 적합합니다. 아이들이 좋아하는 메뉴와 넓은 좌석을 갖추고 있습니다.',
  },
  {
    q: '막탄 코르도바 맛집은 어디인가요?',
    a: '코르도바 지역에는 란타우 코르도바(수상 레스토랑), 파롤라 씨뷰 레스토랑, 성카(씨푸드), 만송이 장미 카페(야경 카페)가 있습니다. 막탄 리조트에서 차로 20~30분 거리입니다.',
  },
  {
    q: '세부 막탄 24시간 맛집은 어디인가요?',
    a: '막탄 뉴타운의 명동24와 공항 근처의 공항근처 명동24가 24시간 운영합니다. 새벽 투어 전후로 든든한 한식을 즐길 수 있어 여행자들에게 인기입니다.',
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleAccordion = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((prev) => !prev);
    if (open) setExpandedIndex(null);
  };

  const toggleItem = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.header} onPress={toggleAccordion}>
        <Text style={styles.headerTitle}>❓ 자주 묻는 질문 (FAQ)</Text>
        <Text style={styles.headerChev}>{open ? '▲' : '▼'}</Text>
      </Pressable>

      {open && (
        <View style={styles.body}>
          {FAQ_ITEMS.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Pressable style={styles.faqQuestion} onPress={() => toggleItem(index)}>
                <Text style={styles.faqQuestionText}>Q. {item.q}</Text>
                <Text style={styles.faqChev}>{expandedIndex === index ? '▲' : '▼'}</Text>
              </Pressable>
              {expandedIndex === index && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{item.a}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginBottom: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(165, 243, 252, 0.25)',
    backgroundColor: 'rgba(0, 0, 0, 0.28)',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.cardHeading,
  },
  headerChev: {
    fontSize: 11,
    color: colors.link,
  },
  body: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(165, 243, 252, 0.15)',
  },
  faqItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text,
    lineHeight: 19,
  },
  faqChev: {
    fontSize: 10,
    color: colors.link,
    marginTop: 2,
  },
  faqAnswer: {
    paddingHorizontal: 14,
    paddingBottom: 12,
    paddingTop: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.18)',
  },
  faqAnswerText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 19,
    color: colors.textMuted,
  },
});
