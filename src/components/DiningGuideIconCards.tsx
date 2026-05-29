import React, { useCallback, useMemo, useState } from 'react';
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
import { NIGHT_MARKET_BLOG_LINKS } from '../constants/nightMarketMapLinks';
import { colors, diningGuideTipTheme, fonts } from '../constants/theme';
import { openExternalUrl } from '../utils/openExternalUrl';
import { PhilippineFoodSection } from './PhilippineFoodSection';

type ExpandLinkLayout = 'default' | 'fruitRow4' | 'grid2x2';

/** 2x3 그리드 — 3열 균등 분할 */
const GRID_GAP = 7;

/** 과일 상세 4열 버튼만 큼직하게 (메인·안내 문구와 분리) */
const FRUIT_LINK_SCALE = 1.3;
const fruitS = (n: number) => Math.round(n * FRUIT_LINK_SCALE);

const MANGOSTEEN_LABEL = '망고스틴 고르는법';
const FILIPINO_TRAD_FOOD_LABEL = '필리핀 전통먹거리';
const FILIPINO_RECOMMEND_LABEL = '세부추천음식';

const TIP_BUTTON_HEIGHT = 84;
const TIP_BUTTON_RADIUS = 10;
const CARD_ICON_FONT_SIZE = 26;
const CARD_ICON_LINE_HEIGHT = 30;
const EXPAND_LINK_DEFAULT_MIN_HEIGHT = 56;
const EXPAND_LINK_DEFAULT_ICON_SIZE = 16;
const NIGHT_MARKET_LABEL_FONT_SIZE = 12;
const NIGHT_MARKET_CELL_MIN_HEIGHT = 78;

if (Platform.OS === 'android') {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

// 웹에서 야시장 후기 링크 라벨이 좁은 칸에서 한 글자씩 끊기지 않고
// 단어(어절) 단위로 줄바꿈되도록 실제 CSS를 주입한다. (RN-web 스타일 누락 방지)
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const NM_LABEL_STYLE_ID = 'nm-blog-label-style';
  if (!document.getElementById(NM_LABEL_STYLE_ID)) {
    const styleEl = document.createElement('style');
    styleEl.id = NM_LABEL_STYLE_ID;
    styleEl.textContent =
      '[data-nmlabel="true"]{word-break:keep-all!important;white-space:normal!important;overflow-wrap:break-word!important;text-align:center!important;}';
    document.head.appendChild(styleEl);
  }
}

function NightMarketBlogLinkRow({
  onOpenLink,
}: {
  onOpenLink: (url: string, title: string) => void;
}) {
  if (!NIGHT_MARKET_BLOG_LINKS.length) {
    return (
      <Text style={styles.nightMarketLinksFallback}>
        야시장 링크를 불러오지 못했습니다. 앱을 새로고침해 주세요.
      </Text>
    );
  }

  return (
    <View style={styles.nightMarketMapRow}>
      {NIGHT_MARKET_BLOG_LINKS.map((link) => (
        <Pressable
          key={link.label}
          style={({ pressed }) => [
            styles.nightMarketMapCell,
            pressed && styles.nightMarketMapCellPressed,
          ]}
          onPress={() => onOpenLink(link.url, link.blogTitle)}
          accessibilityRole="link"
          accessibilityLabel={link.label}
          accessibilityHint={`${link.blogTitle} 블로그로 이동합니다`}
        >
          <Text style={styles.nightMarketMapEmoji} accessibilityElementsHidden>
            {link.emoji}
          </Text>
          <Text
            style={styles.nightMarketMapLabel}
            numberOfLines={3}
            {...(Platform.OS === 'web'
              ? ({ dataSet: { nmlabel: 'true' } } as object)
              : null)}
          >
            {link.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
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

interface TipMenuButtonProps {
  tip: DiningGuideTip;
  isActive: boolean;
  onPress: () => void;
}

function TipMenuButton({ tip, isActive, onPress }: TipMenuButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed, hovered }) => [
        styles.tipButton,
        isActive && styles.tipButtonActive,
        (pressed || hovered) && styles.tipButtonInteractive,
      ]}
      accessibilityRole="button"
      accessibilityLabel={tip.title}
      accessibilityState={{ expanded: isActive }}
    >
      <View style={styles.tipButtonContent} importantForAccessibility="no-hide-descendants">
        <Text
          style={styles.tipButtonIcon}
          accessible={false}
          importantForAccessibility="no"
        >
          {tip.icon}
        </Text>
        <Text
          style={styles.tipButtonLabel}
          accessible={false}
          importantForAccessibility="no"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {tip.compactTitle}
        </Text>
      </View>
    </Pressable>
  );
}

interface DiningGuideIconCardsProps {
  onOpenLink: (url: string, title: string) => void;
  nightMarketMode?: boolean;
  onNightMarketModeChange?: (active: boolean) => void;
  selectedNightMarketId?: string | null;
  onSelectNightMarket?: (id: string) => void;
}

export function DiningGuideIconCards({
  onOpenLink,
  nightMarketMode = false,
  onNightMarketModeChange,
  selectedNightMarketId = null,
  onSelectNightMarket,
}: DiningGuideIconCardsProps) {
  const [expandedId, setExpandedId] = useState<DiningGuideTipId | null>(null);

  const GRID_ROWS = useMemo<DiningGuideTip[][]>(
    () => [DINING_GUIDE_TIPS.slice(0, 3), DINING_GUIDE_TIPS.slice(3, 6)],
    [],
  );

  const handlePress = useCallback(
    (id: DiningGuideTipId) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedId((prev) => {
        const next = prev === id ? null : id;
        onNightMarketModeChange?.(next === 'night-market');
        return next;
      });
    },
    [onNightMarketModeChange]
  );

  const expanded = DINING_GUIDE_TIPS.find((t) => t.id === expandedId);

  const renderExpandLink = useCallback(
    (link: DiningGuideExpandLink, layout: ExpandLinkLayout) => {
      const isFruitRow4 = layout === 'fruitRow4';
      const isMangostein = link.label === MANGOSTEEN_LABEL;
      const isFilipinoTrad = link.label === FILIPINO_TRAD_FOOD_LABEL;
      const isFilipinoRecommend = link.label === FILIPINO_RECOMMEND_LABEL;
      const useTightRow4Text = isMangostein || isFilipinoTrad || isFilipinoRecommend;

      const openLink = () => {
        if (link.openInNewTab) {
          openExternalUrl(link.url);
          return;
        }
        onOpenLink(link.url, link.blogTitle);
      };

      return (
        <Pressable
          key={link.url}
          onPress={openLink}
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
              isFruitRow4 && useTightRow4Text && styles.expandLinkBtnTextFruitTight,
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit={isFruitRow4 && !useTightRow4Text}
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
    (tip: DiningGuideTip) => (
      <TipMenuButton
        key={tip.id}
        tip={tip}
        isActive={expandedId === tip.id || (tip.id === 'night-market' && nightMarketMode)}
        onPress={() => handlePress(tip.id)}
      />
    ),
    [expandedId, handlePress, nightMarketMode],
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

      {expanded?.id === 'filipino-food' ? (
        <View
          style={styles.filipinoFoodPanelWrap}
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${expanded.title} 상세 정보`}
        >
          <PhilippineFoodSection onOpenLink={onOpenLink} />
        </View>
      ) : expanded ? (
        <View
          style={styles.expandPanel}
          accessibilityLiveRegion="polite"
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
          ) : expanded.id === 'night-market' ? (
            <NightMarketBlogLinkRow onOpenLink={onOpenLink} />
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
    marginHorizontal: 8,
    marginTop: 10,
    marginBottom: 10,
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
  tipButton: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    height: TIP_BUTTON_HEIGHT,
    borderRadius: TIP_BUTTON_RADIUS,
    borderWidth: 1,
    borderColor: diningGuideTipTheme.border,
    backgroundColor: diningGuideTipTheme.bg,
    paddingVertical: 8,
    paddingHorizontal: 4,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    ...(Platform.OS === 'web'
      ? ({ cursor: 'pointer', transition: 'transform 0.15s ease, opacity 0.15s ease' } as object)
      : null),
  },
  tipButtonContent: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tipButtonActive: {
    borderColor: diningGuideTipTheme.borderActive,
    backgroundColor: 'rgba(11, 37, 46, 0.78)',
    shadowOpacity: 0.28,
    shadowRadius: 6,
    elevation: 3,
  },
  tipButtonInteractive: {
    opacity: 0.88,
    transform: [{ scale: 0.96 }],
  },
  tipButtonIcon: {
    fontSize: CARD_ICON_FONT_SIZE,
    lineHeight: CARD_ICON_LINE_HEIGHT,
    marginBottom: 0,
    ...(Platform.OS === 'web'
      ? ({ userSelect: 'none', pointerEvents: 'none' } as object)
      : null),
  },
  tipButtonLabel: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fonts.semiBold,
    color: diningGuideTipTheme.text,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 2,
    marginTop: 0,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
    ...(Platform.OS === 'web'
      ? ({
          userSelect: 'none',
          pointerEvents: 'none',
          color: diningGuideTipTheme.text,
        } as object)
      : null),
  },
  filipinoFoodPanelWrap: {
    marginTop: GRID_GAP,
    width: '100%',
  },
  expandPanel: {
    marginTop: GRID_GAP,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: TIP_BUTTON_RADIUS,
    backgroundColor: diningGuideTipTheme.panelBg,
    borderWidth: 1,
    borderColor: diningGuideTipTheme.panelBorder,
  },
  expandLead: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    lineHeight: 21,
    color: diningGuideTipTheme.text,
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
    ...(Platform.OS === 'web'
      ? ({ whiteSpace: 'nowrap' } as object)
      : null),
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
  nightMarketMapRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    flexWrap: 'nowrap',
    gap: 6,
    width: '100%',
    marginTop: 10,
    ...(Platform.OS === 'web'
      ? ({ display: 'flex' } as object)
      : null),
  },
  nightMarketMapCell: {
    flex: 1,
    flexBasis: 0,
    minWidth: 0,
    minHeight: NIGHT_MARKET_CELL_MIN_HEIGHT,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: diningGuideTipTheme.bg,
    borderWidth: 1,
    borderColor: diningGuideTipTheme.panelBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  nightMarketMapCellPressed: {
    opacity: 0.88,
    backgroundColor: 'rgba(11, 37, 46, 0.78)',
    borderColor: diningGuideTipTheme.borderActive,
  },
  nightMarketMapEmoji: {
    fontSize: 20,
    lineHeight: 24,
    marginBottom: 2,
  },
  nightMarketLinksFallback: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.textDesc,
    textAlign: 'center',
  },
  nightMarketMapLabel: {
    fontSize: NIGHT_MARKET_LABEL_FONT_SIZE,
    fontFamily: fonts.bold,
    lineHeight: 16,
    color: colors.text,
    textAlign: 'center',
    width: '100%',
    paddingHorizontal: 1,
    ...(Platform.OS === 'web'
      ? ({
          whiteSpace: 'normal',
          wordBreak: 'keep-all',
          overflowWrap: 'break-word',
        } as object)
      : null),
  },
});
