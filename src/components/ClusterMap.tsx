import { useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { colors, fonts, MACTAN_CENTER, menuTypeColors } from '../constants/theme';
import { ClusterMapProps, collectVisibleMapPoints } from './mapTypes';

export const MAP_HEIGHT = 280;

const RESORT_PIN = '#1a73e8';

export function ClusterMap({
  restaurants,
  resorts,
  mapLayerMode,
  showRestaurants,
  showResorts,
  focusedItemId,
  focusedResortId,
  onSelectRestaurant,
  onSelectResort,
}: ClusterMapProps) {
  const mapRef = useRef<MapView>(null);

  const visiblePoints = useMemo(
    () => collectVisibleMapPoints(restaurants, resorts, showRestaurants, showResorts),
    [restaurants, resorts, showRestaurants, showResorts]
  );

  useEffect(() => {
    if (!mapRef.current || visiblePoints.length === 0) {
      return;
    }
    const focusId = focusedResortId ?? focusedItemId;
    if (focusId) {
      const target = visiblePoints.find((p) => p.id === focusId);
      if (target) {
        const region: Region = {
          latitude: target.lat,
          longitude: target.lng,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        };
        mapRef.current.animateToRegion(region, 450);
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
  }, [focusedItemId, focusedResortId, visiblePoints]);

  const mapVisible = showRestaurants || showResorts;

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
                description={restaurant.desc}
                pinColor={
                  menuTypeColors[restaurant.menuType] ?? menuTypeColors['기타']
                }
                onPress={() => onSelectRestaurant(restaurant.id)}
              />
            ))}
          {showResorts &&
            resorts.map((resort) => (
              <Marker
                key={`resort-${resort.id}`}
                coordinate={{ latitude: resort.lat, longitude: resort.lng }}
                title={resort.name}
                description={`아침: ${resort.breakfast.slice(0, 40)}…`}
                pinColor={RESORT_PIN}
                onPress={() => onSelectResort(resort.id)}
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
