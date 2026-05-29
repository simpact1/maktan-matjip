import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  LayoutAnimation,
  ListRenderItem,
  Platform,
  Text,
  UIManager,
  View,
} from 'react-native';
import {
  CompanionFilterTag,
  GuideListMode,
  MenuType,
  Restaurant,
  RestaurantZone,
} from '../types/restaurant';
import { NightMarket } from '../types/nightMarket';
import { MactanResort } from '../types/resort';
import {
  pickupDropRestaurants,
  viewSpotRestaurants,
  restaurants as allRestaurants,
} from '../data/restaurants';
import { nightMarkets } from '../data/nightMarkets';
import { mactanResorts } from '../data/resorts';
import { NIGHT_MARKET_GUIDE_PASSAGE } from '../constants/nightMarketGuideText';
import {
  COMPANION_FILTER_OPTIONS,
  MENU_TYPE_OPTIONS,
  ZONE_FILTER_OPTIONS,
} from '../constants/filters';
import { filterRestaurants } from '../utils/filterRestaurants';
import { filterResorts } from '../utils/filterResorts';
import { guideStyles } from '../styles/guideStyles';
import { ClusterMap } from './ClusterMap';
import { MapErrorBoundary } from './MapErrorBoundary';
import { GuideModeSwitch } from './GuideModeSwitch';
import { NightMarketDetailSection } from './NightMarketDetailSection';
import { NightMarketListItem } from './NightMarketListItem';
import { PlaceListItem } from './PlaceListItem';
import { ResortDetailSection } from './ResortDetailSection';
import { ResortListItem } from './ResortListItem';
import { RestaurantDetailSection } from './RestaurantDetailSection';
import { TagFilterBar } from './TagFilterBar';

interface MactanPlacesGuideProps {
  restaurants?: Restaurant[];
  onOpenLink: (url: string, title: string) => void;
  listHeaderTop?: ReactNode;
  nightMarketMode?: boolean;
  selectedNightMarketId?: string | null;
  onSelectNightMarket?: (id: string) => void;
  onClearNightMarketSelection?: () => void;
}

type ListRow =
  | { kind: 'restaurant'; item: Restaurant }
  | { kind: 'resort'; item: MactanResort }
  | { kind: 'nightMarket'; item: NightMarket };

const LIST_FADE_MS = 220;

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export function MactanPlacesGuide({
  restaurants = allRestaurants,
  onOpenLink,
  listHeaderTop,
  nightMarketMode = false,
  selectedNightMarketId = null,
  onSelectNightMarket,
  onClearNightMarketSelection,
}: MactanPlacesGuideProps) {
  const listRef = useRef<FlatList<ListRow>>(null);
  const mapDetailRef = useRef<View>(null);
  const listFade = useRef(new Animated.Value(1)).current;
  const [listMode, setListMode] = useState<GuideListMode>('all');
  const [zone, setZone] = useState<RestaurantZone | null>(null);
  const [menuType, setMenuType] = useState<MenuType | null>(null);
  const [companion, setCompanion] = useState<CompanionFilterTag | null>(null);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [selectedResortId, setSelectedResortId] = useState<string | null>(null);
  const [tabMapActive, setTabMapActive] = useState(true);

  const handleGuideModeChange = useCallback((next: GuideListMode) => {
    if (next === listMode) {
      setTabMapActive((prev) => !prev);
      return;
    }
    setListMode(next);
    setTabMapActive(true);
  }, [listMode]);

  const mapRestaurantSource = useMemo(() => {
    if (listMode === 'pickupDrop') return pickupDropRestaurants;
    if (listMode === 'viewSpots') return viewSpotRestaurants;
    if (listMode === 'resortDining') return [];
    return restaurants;
  }, [listMode, restaurants]);

  const resortZoneFilter = listMode === 'resortDining' ? null : zone;

  const visibleResorts = useMemo(
    () => filterResorts(mactanResorts, { query: '', zone: resortZoneFilter }),
    [resortZoneFilter]
  );

  const mapRestaurants = useMemo(() => {
    if (!tabMapActive || listMode === 'resortDining' || nightMarketMode) return [];
    return filterRestaurants(mapRestaurantSource, {
      zone,
      menuType,
      companion,
      resortMeal: null,
      pickupDropOnly: false,
      query: '',
    });
  }, [tabMapActive, listMode, mapRestaurantSource, zone, menuType, companion, nightMarketMode]);

  const mapResorts = useMemo(() => {
    if (!tabMapActive || nightMarketMode) return [];
    if (listMode === 'pickupDrop' || listMode === 'viewSpots') return [];
    return visibleResorts;
  }, [tabMapActive, listMode, visibleResorts, nightMarketMode]);

  const showNightMarketsOnMap = nightMarketMode && tabMapActive;

  const showRestaurantsOnMap =
    !nightMarketMode &&
    tabMapActive &&
    listMode !== 'resortDining' &&
    mapRestaurants.length > 0;

  const showResortMarkersOnMap =
    !nightMarketMode &&
    tabMapActive &&
    mapResorts.length > 0 &&
    listMode !== 'pickupDrop' &&
    listMode !== 'viewSpots';

  const showResortsInList =
    showResortMarkersOnMap &&
    (listMode === 'resortDining' || (listMode === 'all' && zone !== null));

  const visibleListRows = useMemo((): ListRow[] => {
    if (nightMarketMode) {
      return (nightMarkets ?? []).map((item) => ({
        kind: 'nightMarket' as const,
        item,
      }));
    }
    const rows: ListRow[] = [];
    if (showRestaurantsOnMap) {
      for (const item of mapRestaurants) {
        rows.push({ kind: 'restaurant', item });
      }
    }
    if (showResortsInList) {
      for (const item of mapResorts) {
        rows.push({ kind: 'resort', item });
      }
    }
    return rows;
  }, [nightMarketMode, showRestaurantsOnMap, showResortsInList, mapRestaurants, mapResorts]);

  const listVisible = visibleListRows.length > 0;

  const flatListData = useMemo(
    () => (listVisible ? visibleListRows : []),
    [listVisible, visibleListRows]
  );

  const prevListVisible = useRef(listVisible);

  useEffect(() => {
    if (prevListVisible.current === listVisible) {
      return;
    }
    prevListVisible.current = listVisible;

    LayoutAnimation.configureNext(
      LayoutAnimation.create(LIST_FADE_MS, 'easeInEaseOut', 'opacity')
    );

    Animated.timing(listFade, {
      toValue: listVisible ? 1 : 0,
      duration: LIST_FADE_MS,
      useNativeDriver: Platform.OS !== 'web',
    }).start();
  }, [listVisible, listFade]);

  useEffect(() => {
    setSelectedRestaurantId(null);
    setSelectedResortId(null);
  }, [listMode, zone, menuType, companion, tabMapActive]);

  useEffect(() => {
    if (!nightMarketMode) {
      onClearNightMarketSelection?.();
      return;
    }
    setTabMapActive(true);
    setListMode('all');
    setSelectedRestaurantId(null);
    setSelectedResortId(null);
  }, [nightMarketMode, onClearNightMarketSelection]);

  const selectedRestaurant = useMemo(
    () => mapRestaurants.find((r) => r.id === selectedRestaurantId) ?? null,
    [mapRestaurants, selectedRestaurantId]
  );

  const selectedResort = useMemo(
    () => mactanResorts.find((r) => r.id === selectedResortId) ?? null,
    [selectedResortId]
  );

  const selectedNightMarket = useMemo(
    () => nightMarkets.find((m) => m.id === selectedNightMarketId) ?? null,
    [selectedNightMarketId]
  );

  const scrollToMapDetail = useCallback(() => {
    if (Platform.OS === 'web') {
      const node =
        document.getElementById('map-detail-section') ??
        (mapDetailRef.current as unknown as HTMLElement | null);
      node?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (!selectedRestaurantId && !selectedResortId && !selectedNightMarketId) {
      return;
    }
    const timer = setTimeout(scrollToMapDetail, 80);
    return () => clearTimeout(timer);
  }, [selectedRestaurantId, selectedResortId, selectedNightMarketId, scrollToMapDetail]);

  const handleSelectRestaurant = useCallback(
    (id: string) => {
      onClearNightMarketSelection?.();
      setSelectedResortId(null);
      setSelectedRestaurantId(id);
    },
    [onClearNightMarketSelection]
  );

  const handleSelectResort = useCallback(
    (id: string) => {
      onClearNightMarketSelection?.();
      setSelectedRestaurantId(null);
      setSelectedResortId(id);
    },
    [onClearNightMarketSelection]
  );

  const handleSelectNightMarket = useCallback(
    (id: string) => {
      setSelectedRestaurantId(null);
      setSelectedResortId(null);
      onSelectNightMarket?.(id);
    },
    [onSelectNightMarket]
  );

  const handleClearMapSelection = useCallback(() => {
    setSelectedRestaurantId(null);
    setSelectedResortId(null);
    onClearNightMarketSelection?.();
  }, [onClearNightMarketSelection]);

  const renderItem: ListRenderItem<ListRow> = useCallback(
    ({ item: row }) => {
      let card: ReactNode;
      if (row.kind === 'nightMarket') {
        card = (
          <NightMarketListItem
            market={row.item}
            isSelected={selectedNightMarketId === row.item.id}
            onSelect={() => handleSelectNightMarket(row.item.id)}
          />
        );
      } else if (row.kind === 'resort') {
        card = (
          <ResortListItem
            resort={row.item}
            isSelected={selectedResortId === row.item.id}
            onSelect={() => handleSelectResort(row.item.id)}
          />
        );
      } else {
        card = (
          <PlaceListItem
            restaurant={row.item}
            isSelected={selectedRestaurantId === row.item.id}
            onSelect={() => handleSelectRestaurant(row.item.id)}
          />
        );
      }

      return <Animated.View style={{ opacity: listFade }}>{card}</Animated.View>;
    },
    [
      handleSelectNightMarket,
      handleSelectResort,
      handleSelectRestaurant,
      listFade,
      selectedNightMarketId,
      selectedResortId,
      selectedRestaurantId,
    ]
  );

  const cardTitle = nightMarketMode
    ? '막탄·세부시티 야시장'
    : listMode === 'pickupDrop'
      ? '픽업·드랍 가능 맛집'
      : listMode === 'viewSpots'
        ? '뷰/야경맛집'
        : listMode === 'resortDining'
          ? `막탄 ${mactanResorts.length}대 리조트 다이닝`
          : '막탄 맛집 & 카페';

  const listHeader = (
    <View>
      {listHeaderTop}

      <GuideModeSwitch
        mode={listMode}
        mapActive={tabMapActive}
        pickupCount={pickupDropRestaurants.length}
        viewSpotCount={viewSpotRestaurants.length}
        resortDiningCount={mactanResorts.length}
        totalCount={restaurants.length}
        onChange={handleGuideModeChange}
      />

      <View style={guideStyles.infoCard}>
        <Text style={guideStyles.cardTitle}>{cardTitle}</Text>

        {nightMarketMode ? (
          <View style={guideStyles.nightMarketBanner}>
            <Text style={guideStyles.nightMarketBannerTitle}>🌙 야시장</Text>
            <Text style={guideStyles.nightMarketBannerText}>{NIGHT_MARKET_GUIDE_PASSAGE}</Text>
            <Text style={[guideStyles.nightMarketBannerText, guideStyles.nightMarketBannerHint]}>
              지도 🎪 마커 또는 아래 목록을 탭하면 위치·생생 후기를 볼 수 있습니다.
            </Text>
          </View>
        ) : listMode === 'pickupDrop' ? (
          <View style={guideStyles.pickupBanner}>
            <Text style={guideStyles.pickupBannerTitle}>
              리조트·호텔 ↔ 식당 무료 송영
            </Text>
            <Text style={guideStyles.pickupBannerText}>
              막탄 숙소에서 왕복 픽업·드랍이 가능한 곳만 모았습니다.
            </Text>
          </View>
        ) : listMode === 'viewSpots' ? (
          <View style={guideStyles.mealBanner}>
            <Text style={guideStyles.mealBannerTitle}>파노라마 오션뷰와 환상적인 시티 야경 맛집</Text>
            <Text style={guideStyles.mealBannerText}>
              낮에는 푸른 바다와 선셋을, 밤에는 반짝이는 루프탑과 로맨틱한 야경을 즐길 수 있는 명소만 모았습니다.
            </Text>
          </View>
        ) : listMode === 'resortDining' ? (
          <View style={guideStyles.resortBanner}>
            <Text style={guideStyles.resortBannerTitle}>
              {mactanResorts.length}개 주요 리조트 식사 실전 가이드
            </Text>
            <Text style={guideStyles.resortBannerText}>
              각 리조트 내 뷔페·레스토랑 팁을 정리했습니다. 지도의{' '}
              <Text style={guideStyles.leadStrong}>🏨 파란 마커</Text>를 탭하면 지도 아래에 상세
              정보가 표시됩니다.
            </Text>
          </View>
        ) : (
          <Text style={guideStyles.lead}>
            <Text style={guideStyles.leadStrong}>맛집 54곳</Text>과{' '}
            <Text style={guideStyles.leadStrong}>리조트 {mactanResorts.length}곳</Text> 식사 정보를
            지도에서 함께 볼 수 있습니다. 마커를 탭하면 지도 아래에 상세 정보가 표시됩니다.
          </Text>
        )}
      </View>

      <View style={guideStyles.mapSection}>
        <MapErrorBoundary
          resetKey={`${nightMarketMode ? 'night' : listMode}-${zone ?? 'all'}`}
        >
          <ClusterMap
            restaurants={mapRestaurants}
            resorts={mapResorts}
            nightMarkets={nightMarkets}
            showRestaurants={showRestaurantsOnMap}
            showResorts={showResortMarkersOnMap}
            showNightMarkets={showNightMarketsOnMap}
            selectedRestaurantId={selectedRestaurantId}
            selectedResortId={selectedResortId}
            selectedNightMarketId={selectedNightMarketId}
            onSelectRestaurant={handleSelectRestaurant}
            onSelectResort={handleSelectResort}
            onSelectNightMarket={handleSelectNightMarket}
            onClearMapSelection={handleClearMapSelection}
          />
        </MapErrorBoundary>
        {selectedRestaurant || selectedResort || selectedNightMarket ? (
          <View ref={mapDetailRef} nativeID="map-detail-section">
            {selectedRestaurant ? (
              <RestaurantDetailSection restaurant={selectedRestaurant} onOpenLink={onOpenLink} />
            ) : null}
            {selectedResort ? (
              <ResortDetailSection resort={selectedResort} onOpenLink={onOpenLink} />
            ) : null}
            {selectedNightMarket ? (
              <NightMarketDetailSection market={selectedNightMarket} onOpenLink={onOpenLink} />
            ) : null}
          </View>
        ) : null}
      </View>

      {!nightMarketMode && listMode !== 'resortDining' ? (
        <View style={guideStyles.filterCard}>
          <TagFilterBar
            label="📍 위치에 따른 구분"
            options={ZONE_FILTER_OPTIONS}
            selected={zone}
            onSelect={setZone}
            showAllOption={false}
          />
          <TagFilterBar
            label="🍽 음식에 따른 구분"
            options={MENU_TYPE_OPTIONS}
            selected={menuType}
            onSelect={setMenuType}
            showAllOption={false}
          />
          <TagFilterBar
            label="👥 동반자에 따른 구분"
            options={COMPANION_FILTER_OPTIONS}
            selected={companion}
            onSelect={setCompanion}
            showAllOption={false}
          />
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      ref={listRef}
      data={flatListData}
      extraData={{
        listVisible,
        selectedRestaurantId,
        selectedResortId,
        selectedNightMarketId,
        nightMarketMode,
      }}
      keyExtractor={(row) => `${row.kind}-${row.item.id}`}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      contentContainerStyle={guideStyles.listContent}
      style={guideStyles.root}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator
      initialNumToRender={14}
      onScrollToIndexFailed={(info) => {
        listRef.current?.scrollToOffset({
          offset: info.averageItemLength * info.index,
          animated: true,
        });
      }}
    />
  );
}
