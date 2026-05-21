import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import {
  CompanionFilterTag,
  GuideListMode,
  MenuType,
  ResortMealFilter,
  Restaurant,
  RestaurantZone,
} from '../types/restaurant';
import { MactanResort } from '../types/resort';
import {
  pickupDropRestaurants,
  resortMealRestaurants,
  restaurants as allRestaurants,
} from '../data/restaurants';
import { mactanResorts } from '../data/resorts';
import {
  COMPANION_FILTER_OPTIONS,
  MENU_TYPE_OPTIONS,
  ZONE_FILTER_OPTIONS,
} from '../constants/filters';
import { filterRestaurants } from '../utils/filterRestaurants';
import { filterResorts } from '../utils/filterResorts';
import { guideStyles } from '../styles/guideStyles';
import { ClusterMap } from './ClusterMap';
import { GuideModeSwitch } from './GuideModeSwitch';
import { MapLayerMode, MapLayerToggle } from './MapLayerToggle';
import { PlaceListItem } from './PlaceListItem';
import { ResortListItem } from './ResortListItem';
import { DiningGuideIconCards } from './DiningGuideIconCards';
import { TagFilterBar } from './TagFilterBar';

interface MactanPlacesGuideProps {
  restaurants?: Restaurant[];
  onOpenLink: (url: string, title: string) => void;
  listHeaderTop?: ReactNode;
}

type ListRow =
  | { kind: 'restaurant'; item: Restaurant }
  | { kind: 'resort'; item: MactanResort };

export function MactanPlacesGuide({
  restaurants = allRestaurants,
  onOpenLink,
  listHeaderTop,
}: MactanPlacesGuideProps) {
  const listRef = useRef<FlatList<ListRow>>(null);
  const [listMode, setListMode] = useState<GuideListMode>('all');
  const [resortMealFilter, setResortMealFilter] = useState<ResortMealFilter>(null);
  const [zone, setZone] = useState<RestaurantZone | null>(null);
  const [menuType, setMenuType] = useState<MenuType | null>(null);
  const [companion, setCompanion] = useState<CompanionFilterTag | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [mapLayerMode, setMapLayerMode] = useState<MapLayerMode>('none');

  const sourceList = useMemo(() => {
    if (listMode === 'pickupDrop') return pickupDropRestaurants;
    if (listMode === 'resortMeal') return resortMealRestaurants;
    if (listMode === 'resortDining') return [];
    return restaurants;
  }, [listMode, restaurants]);

  const filteredRestaurants = useMemo(
    () =>
      filterRestaurants(sourceList, {
        zone,
        menuType,
        companion,
        resortMeal: listMode === 'resortMeal' ? resortMealFilter : null,
        pickupDropOnly: false,
        query: '',
      }),
    [sourceList, zone, menuType, companion, listMode, resortMealFilter]
  );

  const filteredResorts = useMemo(() => filterResorts(mactanResorts, ''), []);

  const listRows = useMemo((): ListRow[] => {
    if (listMode === 'resortDining') {
      return filteredResorts.map((item) => ({ kind: 'resort', item }));
    }
    return filteredRestaurants.map((item) => ({ kind: 'restaurant', item }));
  }, [listMode, filteredResorts, filteredRestaurants]);

  const mapRestaurants =
    listMode === 'resortDining' ? [] : filteredRestaurants;

  const hasTagFilter = zone !== null || menuType !== null || companion !== null;

  const showRestaurantsOnMap =
    listMode !== 'resortDining' &&
    (hasTagFilter ||
      mapLayerMode === 'all' ||
      mapLayerMode === 'restaurants');
  const showResortsOnMap =
    !hasTagFilter && (mapLayerMode === 'all' || mapLayerMode === 'resorts');
  const mapShowsResortsOnly = mapLayerMode === 'resorts' && !hasTagFilter;

  const flatListData = mapShowsResortsOnly ? [] : listRows;

  useEffect(() => {
    setOpenId(null);
  }, [listMode, resortMealFilter, zone, menuType, companion, mapLayerMode]);

  useEffect(() => {
    setResortMealFilter(null);
  }, [listMode]);

  useEffect(() => {
    setMapLayerMode('none');
  }, [listMode]);

  const toggleItem = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const scrollToRow = useCallback(
    (id: string) => {
      if (mapShowsResortsOnly) {
        return;
      }
      const index = listRows.findIndex((row) => row.item.id === id);
      if (index >= 0) {
        listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.3 });
      }
    },
    [listRows, mapShowsResortsOnly]
  );

  const handleSelectRestaurant = useCallback(
    (id: string) => {
      setOpenId(id);
      scrollToRow(id);
    },
    [scrollToRow]
  );

  const handleSelectResort = useCallback(
    (id: string) => {
      setOpenId(id);
      scrollToRow(id);
    },
    [scrollToRow]
  );

  const renderItem: ListRenderItem<ListRow> = useCallback(
    ({ item: row }) => {
      if (row.kind === 'resort') {
        return (
          <ResortListItem
            resort={row.item}
            isOpen={openId === row.item.id}
            onToggle={() => toggleItem(row.item.id)}
          />
        );
      }
      return (
        <PlaceListItem
          restaurant={row.item}
          isOpen={openId === row.item.id}
          onToggle={() => toggleItem(row.item.id)}
          onOpenLink={(url) => onOpenLink(url, row.item.name)}
        />
      );
    },
    [onOpenLink, openId, toggleItem]
  );

  const cardTitle =
    listMode === 'pickupDrop'
      ? '픽업·드랍 가능 맛집'
      : listMode === 'resortMeal'
        ? '리조트 밖에서 식사 맛집'
        : listMode === 'resortDining'
          ? '막탄 11대 리조트 다이닝'
          : '막탄 맛집 & 카페';

  const listHeader = (
    <View>
      {listHeaderTop}

      <GuideModeSwitch
        mode={listMode}
        pickupCount={pickupDropRestaurants.length}
        resortMealCount={resortMealRestaurants.length}
        resortDiningCount={mactanResorts.length}
        totalCount={restaurants.length}
        onChange={setListMode}
      />

      <View style={guideStyles.card}>
        <Text style={guideStyles.cardTitle}>{cardTitle}</Text>

        {listMode === 'pickupDrop' ? (
          <View style={guideStyles.pickupBanner}>
            <Text style={guideStyles.pickupBannerTitle}>
              리조트·호텔 ↔ 식당 무료 송영
            </Text>
            <Text style={guideStyles.pickupBannerText}>
              막탄 숙소에서 왕복 픽업·드랍이 가능한 곳만 모았습니다.
            </Text>
          </View>
        ) : listMode === 'resortMeal' ? (
          <View style={guideStyles.mealBanner}>
            <Text style={guideStyles.mealBannerTitle}>
              호텔 뷔페 대신 가기 좋은 맛집
            </Text>
            <Text style={guideStyles.mealBannerText}>
              막탄 리조트 숙박 시 호텔 밖에서 식사할 때 추천하는 곳입니다.
            </Text>
          </View>
        ) : listMode === 'resortDining' ? (
          <View style={guideStyles.resortBanner}>
            <Text style={guideStyles.resortBannerTitle}>
              11개 주요 리조트 식사 실전 가이드
            </Text>
            <Text style={guideStyles.resortBannerText}>
              각 리조트 내 뷔페·레스토랑 팁을 정리했습니다. 지도의{' '}
              <Text style={guideStyles.leadStrong}>🏨 파란 마커</Text>를 탭하거나
              목록을 펼쳐 보세요.
            </Text>
          </View>
        ) : (
          <Text style={guideStyles.lead}>
            <Text style={guideStyles.leadStrong}>맛집 53곳</Text>과{' '}
            <Text style={guideStyles.leadStrong}>리조트 11곳</Text> 식사 정보를
            지도에서 함께 볼 수 있습니다.
          </Text>
        )}

        <MapLayerToggle
          mode={mapLayerMode}
          restaurantCount={mapRestaurants.length}
          resortCount={filteredResorts.length}
          onSelect={setMapLayerMode}
          restaurantsOnMap={showRestaurantsOnMap}
          resortsOnMap={showResortsOnMap}
        />

        <View style={guideStyles.mapInCard}>
            <ClusterMap
              restaurants={mapRestaurants}
              resorts={filteredResorts}
              mapLayerMode={mapLayerMode}
              showRestaurants={showRestaurantsOnMap}
              showResorts={showResortsOnMap}
              focusedItemId={
                openId && !openId.startsWith('r') ? openId : null
              }
              focusedResortId={
                openId && openId.startsWith('r') ? openId : null
              }
              onSelectRestaurant={handleSelectRestaurant}
              onSelectResort={handleSelectResort}
            />
        </View>

        {listMode !== 'resortDining' ? (
          <>
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
          </>
        ) : null}
      </View>

      {mapShowsResortsOnly ? (
        filteredResorts.length === 0 ? (
          <View style={guideStyles.card}>
            <Text style={guideStyles.lead}>표시할 항목이 없습니다.</Text>
          </View>
        ) : (
          filteredResorts.map((resort) => (
            <ResortListItem
              key={resort.id}
              resort={resort}
              isOpen={openId === resort.id}
              onToggle={() => toggleItem(resort.id)}
            />
          ))
        )
      ) : flatListData.length === 0 &&
        (mapLayerMode !== 'none' || hasTagFilter) ? (
        <View style={guideStyles.card}>
          <Text style={guideStyles.lead}>표시할 항목이 없습니다.</Text>
        </View>
      ) : null}
    </View>
  );

  const listFooter = (
    <DiningGuideIconCards onOpenLink={onOpenLink} />
  );

  return (
    <FlatList
      ref={listRef}
      data={flatListData}
      keyExtractor={(row) => `${row.kind}-${row.item.id}`}
      renderItem={renderItem}
      ListHeaderComponent={listHeader}
      ListFooterComponent={listFooter}
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
