import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { colors, fonts, MACTAN_CENTER, menuTypeColors } from '../constants/theme';
import { NightMarket } from '../types/nightMarket';
import { ClusterMapProps, collectVisibleMapPoints } from './mapTypes';

export const MAP_HEIGHT = 280;

const RESORT_PIN = '#1a73e8';
const RESORT_PIN_SELECTED = '#0d47a1';
const NIGHT_MARKET_PIN = '#7c3aed';
const NIGHT_MARKET_PIN_SELECTED = '#4c1d95';

export function ClusterMap({
  restaurants,
  resorts,
  nightMarkets,
  showRestaurants,
  showResorts,
  showNightMarkets,
  selectedRestaurantId,
  selectedResortId,
  selectedNightMarketId,
  onSelectRestaurant,
  onSelectResort,
  onSelectNightMarket,
  onClearMapSelection,
}: ClusterMapProps) {
  const mapRef = useRef<MapView>(null);

  const visiblePoints = useMemo(
    () =>
      collectVisibleMapPoints(
        restaurants,
        resorts,
        nightMarkets,
        showRestaurants,
        showResorts,
        showNightMarkets
      ),
    [restaurants, resorts, nightMarkets, showRestaurants, showResorts, showNightMarkets]
  );

  useEffect(() => {
    if (!mapRef.current || visiblePoints.length === 0) {
      return;
    }
    if (selectedNightMarketId && showNightMarkets) {
      const target = nightMarkets.find((m) => m.id === selectedNightMarketId);
      if (target) {
        const region: Region = {
          latitude: target.lat,
          longitude: target.lng,
          latitudeDelta: target.region === 'cebu-city' ? 0.04 : 0.02,
          longitudeDelta: target.region === 'cebu-city' ? 0.04 : 0.02,
        };
        mapRef.current.animateToRegion(region, 550);
      }
      return;
    }
    if (visiblePoints.length === 1) {
      const p = visiblePoints[0]!;
      mapRef.current.animateToRegion(
        {
          latitude: p.lat,
          longitude: p.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        },
        450
      );
    }
  }, [selectedNightMarketId, showNightMarkets, nightMarkets, visiblePoints]);

  const mapVisible = showRestaurants || showResorts || showNightMarkets;

  if (!mapVisible) {
    return (
      <View style={styles.wrap}>
        <View style={[styles.mapBox, styles.mapBoxEmpty]} />
      </View>
    );
  }

  if (visiblePoints.length === 0) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.caption}>선택한 레이어에 표시할 장소가 없습니다.</Text>
        <View style={[styles.mapBox, styles.mapBoxEmpty]} />
      </View>
    );
  }

  return (
    <View style={styles.wrap}>
      <View style={styles.mapBox}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={MACTAN_CENTER}
          scrollEnabled={false}
          zoomTapEnabled={false}
          showsUserLocation
          showsMyLocationButton
          loadingEnabled
          loadingBackgroundColor="#aad3df"
          onPress={() => onClearMapSelection?.()}
        >
          {showRestaurants &&
            restaurants.map((restaurant) => (
              <Marker
                key={`rest-${restaurant.id}`}
                coordinate={{
                  latitude: restaurant.lat,
                  longitude: restaurant.lng,
                }}
                title={restaurant.name}
                description="지도 아래에서 상세 정보를 확인하세요"
                pinColor={menuTypeColors[restaurant.menuType] ?? menuTypeColors['기타']}
                onPress={(event) => {
                  event.stopPropagation?.();
                  onSelectRestaurant(restaurant.id);
                }}
              />
            ))}
          {showResorts &&
            resorts.map((resort) => (
              <Marker
                key={`resort-${resort.id}`}
                coordinate={{ latitude: resort.lat, longitude: resort.lng }}
                title={resort.name}
                description="지도 아래에서 상세 정보를 확인하세요"
                pinColor={
                  selectedResortId === resort.id ? RESORT_PIN_SELECTED : RESORT_PIN
                }
                onPress={(event) => {
                  event.stopPropagation?.();
                  onSelectResort(resort.id);
                }}
              />
            ))}
          {showNightMarkets &&
            (nightMarkets ?? []).map((market) => (
              <Marker
                key={`night-${market.id}`}
                coordinate={{ latitude: market.lat, longitude: market.lng }}
                title={market.name}
                description={market.locationDesc}
                pinColor={
                  selectedNightMarketId === market.id
                    ? NIGHT_MARKET_PIN_SELECTED
                    : NIGHT_MARKET_PIN
                }
                onPress={(event) => {
                  event.stopPropagation?.();
                  onSelectNightMarket(market.id);
                }}
              />
            ))}
        </MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 0 },
  caption: {
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 17,
    color: colors.textMuted,
    marginBottom: 8,
  },
  mapBox: {
    width: '100%',
    height: MAP_HEIGHT,
    borderRadius: 9,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    backgroundColor: '#aad3df',
  },
  mapBoxEmpty: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  map: {
    width: '100%',
    height: MAP_HEIGHT,
  },
});
