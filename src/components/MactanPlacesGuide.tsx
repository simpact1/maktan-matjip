import { ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, ListRenderItem, Text, View } from 'react-native';
import {
  BestForTag,
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
  BEST_FOR_OPTIONS,
  MENU_TYPE_OPTIONS,
  RESORT_MEAL_OPTIONS,
  ZONE_FILTER_OPTIONS,
} from '../constants/filters';
import { filterRestaurants } from '../utils/filterRestaurants';
import { filterResorts } from '../utils/filterResorts';
import { guideStyles } from '../styles/guideStyles';
import { ClusterMap } from './ClusterMap';
import { GuideModeSwitch } from './GuideModeSwitch';
import { MapLayerToggle } from './MapLayerToggle';
import { PlaceListItem } from './PlaceListItem';
import { ResortListItem } from './ResortListItem';
import { SearchBar } from './SearchBar';
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
  const [bestFor, setBestFor] = useState<BestForTag | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [showRestaurantsOnMap, setShowRestaurantsOnMap] = useState(true);
  const [showResortsOnMap, setShowResortsOnMap] = useState(true);

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
        bestFor,
        resortMeal: listMode === 'resortMeal' ? resortMealFilter : null,
        pickupDropOnly: false,
        query: searchQuery,
      }),
    [sourceList, zone, menuType, bestFor, listMode, resortMealFilter, searchQuery]
  );

  const filteredResorts = useMemo(
    () => filterResorts(mactanResorts, searchQuery),
    [searchQuery]
  );

  const listRows = useMemo((): ListRow[] => {
    if (listMode === 'resortDining') {
      return filteredResorts.map((item) => ({ kind: 'resort', item }));
    }
    return filteredRestaurants.map((item) => ({ kind: 'restaurant', item }));
  }, [listMode, filteredResorts, filteredRestaurants]);

  const mapRestaurants =
    listMode === 'resortDining' ? [] : filteredRestaurants;

  useEffect(() => {
    setOpenId(null);
  }, [listMode, resortMealFilter, zone, menuType, bestFor, searchQuery]);

  useEffect(() => {
    setResortMealFilter(null);
  }, [listMode]);

  useEffect(() => {
    if (listMode === 'resortDining') {
      setShowRestaurantsOnMap(false);
      setShowResortsOnMap(true);
    } else {
      setShowRestaurantsOnMap(true);
      setShowResortsOnMap(true);
    }
  }, [listMode]);

  const toggleItem = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const scrollToRow = useCallback(
    (id: string) => {
      const index = listRows.findIndex((row) => row.item.id === id);
      if (index >= 0) {
        listRef.current?.scrollToIndex({ index, animated: true, viewPosition: 0.3 });
      }
    },
    [listRows]
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
        ? '리조트 조식·석식 맛집'
        : listMode === 'resortDining'
          ? '막탄 11대 리조트 다이닝'
          : '막탄 맛집 & 카페';

  const breakfastCount = resortMealRestaurants.filter((r) =>
    r.resortMeal.includes('조식')
  ).length;
  const dinnerCount = resortMealRestaurants.filter((r) =>
    r.resortMeal.includes('석식')
  ).length;

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
              막탄 리조트 숙박 시 조식·석식을 호텔 밖에서 해결할 때 추천하는 곳입니다.
            </Text>
          </View>
        ) : listMode === 'resortDining' ? (
          <View style={guideStyles.resortBanner}>
            <Text style={guideStyles.resortBannerTitle}>
              11개 주요 리조트 조·석식 실전 가이드
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
            <Text style={guideStyles.leadStrong}>리조트 11곳</Text> 조·석식 정보를
            지도에서 함께 볼 수 있습니다.
          </Text>
        )}

        <View style={guideStyles.searchWrap}>
          <SearchBar value={searchQuery} onChangeText={setSearchQuery} />
        </View>

        {listMode === 'resortMeal' ? (
          <TagFilterBar
            label="🍳 식사 시간"
            options={RESORT_MEAL_OPTIONS}
            selected={resortMealFilter}
            onSelect={setResortMealFilter}
          />
        ) : null}

        {listMode !== 'resortDining' ? (
          <>
            <TagFilterBar
              label="📍 제이파크근처 · 막탄뉴타운 근처 · 마리바고 근처 · 공항주변 · 코르도바"
              options={ZONE_FILTER_OPTIONS}
              selected={zone}
              onSelect={setZone}
              showAllOption={false}
            />
            <TagFilterBar
              label="🍽 씨푸드 · 한식 · 로컬 · 일식 · 중식 · 뷰맛집 · 뷔페 · 카페/디저트 · 기타"
              options={MENU_TYPE_OPTIONS}
              selected={menuType}
              onSelect={setMenuType}
              showAllOption={false}
            />
            <TagFilterBar
              label="✨ 이럴 때"
              options={BEST_FOR_OPTIONS}
              selected={bestFor}
              onSelect={setBestFor}
            />
          </>
        ) : null}

        <Text style={guideStyles.resultCount}>
          {listRows.length}곳 표시 중
          {listMode === 'resortDining'
            ? ` · 리조트 ${mactanResorts.length}곳`
            : listMode === 'pickupDrop'
              ? ` · 픽업·드랍 ${pickupDropRestaurants.length}곳`
              : listMode === 'resortMeal'
                ? ` · 조식 ${breakfastCount} · 석식 ${dinnerCount}`
                : ` · 맛집 ${restaurants.length} · 리조트 ${mactanResorts.length}`}
        </Text>
      </View>

      <View style={guideStyles.mapCard}>
        <MapLayerToggle
          showRestaurants={showRestaurantsOnMap}
          showResorts={showResortsOnMap}
          restaurantCount={mapRestaurants.length}
          resortCount={mactanResorts.length}
          onToggleRestaurants={() => setShowRestaurantsOnMap((v) => !v)}
          onToggleResorts={() => setShowResortsOnMap((v) => !v)}
        />
        <ClusterMap
          restaurants={mapRestaurants}
          resorts={mactanResorts}
          showRestaurants={showRestaurantsOnMap}
          showResorts={showResortsOnMap}
          focusedItemId={
            openId && !openId.startsWith('r') ? openId : null
          }
          focusedResortId={openId && openId.startsWith('r') ? openId : null}
          onSelectRestaurant={handleSelectRestaurant}
          onSelectResort={handleSelectResort}
        />
      </View>

      {listRows.length === 0 ? (
        <View style={guideStyles.card}>
          <Text style={guideStyles.lead}>검색 결과가 없습니다.</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <FlatList
      ref={listRef}
      data={listRows}
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
