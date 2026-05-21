import { useCallback, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import {
  DINING_GUIDE_TIPS,
  DiningGuideTip,
  DiningGuideTipId,
} from '../constants/diningGuideTips';
import { colors, fonts } from '../constants/theme';

/** 2x3 그리드 — 3열 균등 분할 */
const GRID_GAP = 7;
const CARD_GRADIENT = ['#151c28', '#1a2332'] as const;

const GRID_ROWS: DiningGuideTip[][] = [
  DINING_GUIDE_TIPS.slice(0, 3),
  DINING_GUIDE_TIPS.slice(3, 6),
];

interface DiningGuideIconCardsProps {
  onOpenLink: (url: string, title: string) => void;
}

export function DiningGuideIconCards({ onOpenLink }: DiningGuideIconCardsProps) {
  const [expandedId, setExpandedId] = useState<DiningGuideTipId | null>(null);

  const handlePress = useCallback((id: DiningGuideTipId) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const expanded = DINING_GUIDE_TIPS.find((t) => t.id === expandedId);

  const renderExpandLink = (
    label: string,
    url: string,
    blogTitle: string,
    key: string
  ) => (
    <Pressable
      key={key}
      onPress={() => onOpenLink(url, blogTitle)}
      style={({ pressed }) => [
        styles.expandLinkBtnCell,
        styles.expandLinkBtn,
        pressed && styles.expandLinkBtnPressed,
      ]}
      accessibilityRole="link"
    >
      <Text
        style={styles.expandLinkBtnText}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.72}
        ellipsizeMode="clip"
      >
        {label}
      </Text>
    </Pressable>
  );

  const renderCard = (tip: DiningGuideTip) => {
    const isActive = expandedId === tip.id;
    return (
      <Pressable
        key={tip.id}
        onPress={() => handlePress(tip.id)}
        style={({ pressed }) => [
          styles.cardCell,
          isActive && styles.cardOuterActive,
          pressed && styles.cardOuterPressed,
        ]}
        accessibilityRole="button"
        accessibilityLabel={tip.title}
        accessibilityState={{ expanded: isActive }}
      >
        <LinearGradient
          colors={[...CARD_GRADIENT]}
          start={{ x: 0.15, y: 0 }}
          end={{ x: 0.85, y: 1 }}
          style={styles.card}
        >
          <Text style={styles.cardIcon} accessibilityElementsHidden>
            {tip.icon}
          </Text>
          <Text
            style={styles.cardTitle}
            numberOfLines={1}
            adjustsFontSizeToFit
            minimumFontScale={0.78}
            ellipsizeMode="clip"
          >
            {tip.compactTitle}
          </Text>
        </LinearGradient>
      </Pressable>
    );
  };

  return (
    <View style={styles.wrap}>
      <View style={styles.grid}>
        {GRID_ROWS.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(renderCard)}
          </View>
        ))}
      </View>

      {expanded ? (
        <View style={styles.expandPanel}>
          {expanded.expandSimple ? (
            <>
              <Text style={styles.expandLead}>
                {expanded.expandTitle ?? `💡 ${expanded.summary}`}
              </Text>
              {expanded.expandBody ? (
                <Text style={styles.expandBody}>{expanded.expandBody}</Text>
              ) : null}
            </>
          ) : (
            <>
              <Text style={styles.expandHeading}>{expanded.title}</Text>
              <Text style={styles.expandBullet}>• {expanded.summary}</Text>
            </>
          )}
          {expanded.expandLinks?.length ? (
            <View style={styles.expandLinksWrap}>
              {expanded.expandLinks.map((link) =>
                renderExpandLink(link.label, link.url, link.blogTitle, link.url)
              )}
            </View>
          ) : (
            <Pressable
              onPress={() => onOpenLink(expanded.url, expanded.blogTitle)}
              style={({ pressed }) => [
                expanded.expandSimple ? styles.expandLinkBtn : styles.detailLink,
                pressed &&
                  (expanded.expandSimple
                    ? styles.expandLinkBtnPressed
                    : styles.detailLinkPressed),
              ]}
              accessibilityRole="link"
            >
              <Text
                style={
                  expanded.expandSimple
                    ? styles.expandLinkBtnText
                    : styles.detailLinkText
                }
              >
                {expanded.linkLabel ?? '자세히 보기 🔗'}
              </Text>
            </Pressable>
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  /** 2행 3열 — 각 셀 약 33% (gap 제외 균등 분할) */
  grid: {
    gap: GRID_GAP,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: GRID_GAP,
    width: '100%',
  },
  cardCell: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2a3548',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  cardOuterActive: {
    borderColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOpacity: 0.2,
  },
  cardOuterPressed: {
    opacity: 0.92,
  },
  card: {
    minHeight: 92,
    paddingVertical: 9,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  cardIcon: {
    fontSize: 30,
    lineHeight: 33,
  },
  cardTitle: {
    fontSize: 13,
    lineHeight: 15,
    fontFamily: fonts.semiBold,
    color: '#e2e8f0',
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 1,
  },
  expandPanel: {
    marginTop: GRID_GAP,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: 'rgba(21, 28, 40, 0.92)',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.35)',
  },
  expandLead: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    lineHeight: 21,
    color: '#e2e8f0',
    marginBottom: 10,
  },
  expandBody: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 21,
    color: colors.textDesc,
    marginBottom: 12,
  },
  expandLinksWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    width: '100%',
  },
  expandLinkBtnCell: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
  },
  expandLinkBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(3, 105, 161, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(125, 211, 252, 0.45)',
  },
  expandLinkBtnPressed: {
    opacity: 0.88,
    backgroundColor: 'rgba(2, 132, 199, 0.55)',
  },
  expandLinkBtnText: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.link,
    textAlign: 'center',
    lineHeight: 14,
    width: '100%',
    paddingHorizontal: 1,
  },
  expandHeading: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: '#e2e8f0',
    marginBottom: 6,
  },
  expandBullet: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 20,
    color: colors.textDesc,
    marginBottom: 10,
  },
  detailLink: {
    alignSelf: 'flex-start',
  },
  detailLinkPressed: {
    opacity: 0.8,
  },
  detailLinkText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.link,
    textDecorationLine: 'underline',
  },
});
