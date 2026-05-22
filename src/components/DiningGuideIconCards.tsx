import React, { useCallback, useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import {
  LayoutAnimation,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  UIManager,
  View,
} from 'react-native';
import {
  DINING_GUIDE_TIPS,
  DiningGuideExpandLink,
  DiningGuideTip,
  DiningGuideTipId,
} from '../constants/diningGuideTips';
import { colors, fonts } from '../constants/theme';

type ExpandLinkLayout = 'default' | 'fruitRow4' | 'grid2x2';

/** 2x3 그리드 — 3열 균등 분할 */
const GRID_GAP = 7;

/** 과일 상세 4열 버튼만 큼직하게 (메인·안내 문구와 분리) */
const FRUIT_LINK_SCALE = 1.3;
const fruitS = (n: number) => Math.round(n * FRUIT_LINK_SCALE);

const MANGOSTEEN_LABEL = '망고스틴 고르는법';
const CARD_GRADIENT: readonly [string, string] = ['#151c28', '#1a2332'];

const CARD_MIN_HEIGHT = 92;
const CARD_ICON_FONT_SIZE = 30;
const CARD_ICON_LINE_HEIGHT = 33;
const EXPAND_LINK_DEFAULT_MIN_HEIGHT = 56;
const EXPAND_LINK_DEFAULT_ICON_SIZE = 16;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

interface ExpandLinksProps {
  links: DiningGuideExpandLink[];
  onOpenLink: (url: string, title: string) => void;
  renderLink: (
    link: DiningGuideExpandLink,
    layout: ExpandLinkLayout,
  ) => React.ReactNode;
}

function ExpandLinksGrid({ links, renderLink }: ExpandLinksProps) {
  const rows = [links.slice(0, 2), links.slice(2, 4)];
  return (
    <View style={styles.expandLinksGrid}>
      {rows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.expandLinksRow}>
          {row.map((link) => renderLink(link, 'grid2x2'))}
        </View>
      ))}
    </View>
  );
}

function ExpandLinksRow({
  links,
  renderLink,
  isRow4,
}: ExpandLinksProps & { isRow4: boolean }) {
  return (
    <View
      style={[styles.expandLinksWrap, isRow4 && styles.expandLinksWrapRow4]}
    >
      {links.map((link) =>
        renderLink(link, isRow4 ? 'fruitRow4' : 'default'),
      )}
    </View>
  );
}

interface DiningGuideIconCardsProps {
  onOpenLink: (url: string, title: string) => void;
}

export function DiningGuideIconCards({ onOpenLink }: DiningGuideIconCardsProps) {
  const [expandedId, setExpandedId] = useState<DiningGuideTipId | null>(null);

  const GRID_ROWS = useMemo<DiningGuideTip[][]>(
    () => [DINING_GUIDE_TIPS.slice(0, 3), DINING_GUIDE_TIPS.slice(3, 6)],
    [],
  );

  const handlePress = useCallback((id: DiningGuideTipId) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  const expanded = DINING_GUIDE_TIPS.find((t) => t.id === expandedId);

  const renderExpandLink = useCallback(
    (link: DiningGuideExpandLink, layout: ExpandLinkLayout) => {
      const isFruitRow4 = layout === 'fruitRow4';
      const isMangostein = link.label === MANGOSTEEN_LABEL;

      return (
        <Pressable
          key={link.url}
          onPress={() => onOpenLink(link.url, link.blogTitle)}
          style={({ pressed }) => [
            styles.expandLinkBtnCell,
            styles.expandLinkBtn,
            layout === 'grid2x2' && styles.expandLinkBtnCompact,
            isFruitRow4 && styles.expandLinkBtnFruitCompact,
            pressed && styles.expandLinkBtnPressed,
          ]}
          accessibilityRole="link"
          accessibilityLabel={link.label}
          accessibilityHint={`${link.blogTitle} 블로그로 이동합니다`}
        >
          {link.icon ? (
            <Text
              style={
                isFruitRow4 ? styles.expandLinkIconFruit : styles.expandLinkIcon
              }
              accessibilityElementsHidden
            >
              {link.icon}
            </Text>
          ) : null}
          <Text
            style={[
              styles.expandLinkBtnText,
              layout === 'grid2x2' && styles.expandLinkBtnTextCompact,
              isFruitRow4 && styles.expandLinkBtnTextFruit,
              isFruitRow4 && isMangostein && styles.expandLinkBtnTextFruitTight,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit={isFruitRow4 && !isMangostein}
            minimumFontScale={0.72}
            ellipsizeMode="clip"
          >
            {link.label}
          </Text>
        </Pressable>
      );
    },
    [onOpenLink],
  );

  const renderExpandLinks = useCallback(
    (tip: DiningGuideTip) => {
      const links = tip.expandLinks ?? [];
      const compactRow4 =
        tip.expandLinksLayout === 'row' && links.length >= 4;

      if (tip.expandLinksLayout === 'grid2x2' && links.length >= 4) {
        return (
          <ExpandLinksGrid
            links={links}
            onOpenLink={onOpenLink}
            renderLink={renderExpandLink}
          />
        );
      }

      return (
        <ExpandLinksRow
          links={links}
          onOpenLink={onOpenLink}
          renderLink={renderExpandLink}
          isRow4={compactRow4}
        />
      );
    },
    [onOpenLink, renderExpandLink],
  );

  const renderCard = useCallback(
    (tip: DiningGuideTip) => {
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
            colors={CARD_GRADIENT}
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
    },
    [expandedId, handlePress],
  );

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
        <View
          style={styles.expandPanel}
          accessibilityLiveRegion="polite"
          accessibilityRole="region"
          accessibilityLabel={`${expanded.title} 상세 정보`}
        >
          {expanded.expandSimple ? (
            <>
              {expanded.expandTitle ? (
                <Text style={styles.expandLead}>{expanded.expandTitle}</Text>
              ) : null}
              {expanded.expandBody ? (
                <Text style={styles.expandBody}>{expanded.expandBody}</Text>
              ) : !expanded.expandTitle ? (
                <Text style={styles.expandBody}>💡 {expanded.summary}</Text>
              ) : null}
            </>
          ) : (
            <>
              <Text style={styles.expandHeading}>{expanded.title}</Text>
              <Text style={styles.expandBullet}>• {expanded.summary}</Text>
            </>
          )}
          {expanded.expandLinks?.length ? (
            renderExpandLinks(expanded)
          ) : (
            <Pressable
              onPress={() => onOpenLink(expanded.url, expanded.blogTitle)}
              style={({ pressed }) => [
                expanded.expandSimple
                  ? [styles.expandLinkBtn, styles.expandLinkBtnSingle]
                  : styles.detailLink,
                pressed &&
                  (expanded.expandSimple
                    ? styles.expandLinkBtnPressed
                    : styles.detailLinkPressed),
              ]}
              accessibilityRole="link"
              accessibilityHint={`${expanded.blogTitle} 블로그로 이동합니다`}
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
    minHeight: CARD_MIN_HEIGHT,
    paddingVertical: 9,
    paddingHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
  },
  cardIcon: {
    fontSize: CARD_ICON_FONT_SIZE,
    lineHeight: CARD_ICON_LINE_HEIGHT,
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
  expandLinksGrid: {
    gap: 8,
    width: '100%',
  },
  expandLinksRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
  },
  expandLinksWrap: {
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 8,
    width: '100%',
  },
  /** 과일 4열 — 글자 겹침 방지용 간격 */
  expandLinksWrapRow4: {
    gap: fruitS(5),
  },
  expandLinkBtnCompact: {
    paddingVertical: 8,
    paddingHorizontal: 2,
    gap: 2,
    minHeight: EXPAND_LINK_DEFAULT_MIN_HEIGHT,
  },
  expandLinkBtnFruitCompact: {
    paddingVertical: fruitS(8),
    paddingHorizontal: fruitS(2),
    gap: fruitS(2),
    minHeight: fruitS(EXPAND_LINK_DEFAULT_MIN_HEIGHT),
  },
  expandLinkIcon: {
    fontSize: EXPAND_LINK_DEFAULT_ICON_SIZE,
    lineHeight: 18,
  },
  expandLinkIconFruit: {
    fontSize: fruitS(EXPAND_LINK_DEFAULT_ICON_SIZE),
    lineHeight: fruitS(18),
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
    gap: 4,
  },
  expandLinkBtnSingle: {
    alignSelf: 'stretch',
    width: '100%',
    minHeight: 44,
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
  expandLinkBtnTextCompact: {
    fontSize: 9,
    lineHeight: 12,
  },
  expandLinkBtnTextFruit: {
    fontSize: fruitS(9),
    lineHeight: fruitS(12),
    paddingHorizontal: 0,
  },
  /** 망고스틴 — 가장 긴 라벨, 한 줄에 맞춤 */
  expandLinkBtnTextFruitTight: {
    fontSize: 10,
    lineHeight: 13,
    letterSpacing: -0.35,
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
