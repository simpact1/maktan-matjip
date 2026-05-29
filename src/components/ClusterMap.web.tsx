import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, useRef, type CSSProperties } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import type { Marker as LeafletMarker } from 'leaflet';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, MACTAN_CENTER, menuTypeColors } from '../constants/theme';
import { NightMarket } from '../types/nightMarket';
import { Restaurant } from '../types/restaurant';
import { MactanResort } from '../types/resort';
import { ClusterMapProps, collectVisibleMapPoints, MapPoint } from './mapTypes';

export const MAP_HEIGHT = 280;

function categoryIcon(color: string) {
  return L.divIcon({
    className: '',
    html: `<span style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid #fff;display:block;box-shadow:0 1px 4px rgba(0,0,0,0.45)"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

const resortIcon = L.divIcon({
  className: '',
  html: `<span style="background:#1a73e8;width:22px;height:22px;border-radius:6px;border:2px solid #fff;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.35)">🏨</span>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});

const nightMarketIcon = L.divIcon({
  className: '',
  html: `<span style="background:linear-gradient(135deg,#4c1d95,#7c3aed);width:26px;height:26px;border-radius:8px;border:2px solid #fde68a;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 8px rgba(76,29,149,0.45)">🎪</span>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
});

function MapFitBounds({ points }: { points: MapPoint[] }) {
  const map = useMap();
  const boundsKey = useMemo(
    () => points.map((p) => `${p.id}:${p.lat},${p.lng}`).join('|'),
    [points]
  );

  useEffect(() => {
    if (points.length === 0) {
      map.setView([MACTAN_CENTER.latitude, MACTAN_CENTER.longitude], 12);
      return;
    }
    const latlngs = points.map((p) => L.latLng(p.lat, p.lng));
    if (latlngs.length === 1) {
      map.setView(latlngs[0]!, 14);
    } else {
      map.fitBounds(L.latLngBounds(latlngs), { padding: [32, 32], maxZoom: 12 });
    }
    const t = window.setTimeout(() => map.invalidateSize(), 200);
    return () => window.clearTimeout(t);
  }, [map, boundsKey, points]);

  return null;
}

function MapFocusNightMarket({
  nightMarkets,
  selectedNightMarketId,
}: {
  nightMarkets: NightMarket[];
  selectedNightMarketId: string | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (!selectedNightMarketId) {
      return;
    }
    const target = nightMarkets.find((m) => m.id === selectedNightMarketId);
    if (!target) {
      return;
    }
    const zoom = target.region === 'cebu-city' ? 15 : 14;
    map.flyTo([target.lat, target.lng], zoom, { duration: 0.55 });
  }, [map, nightMarkets, selectedNightMarketId]);

  return null;
}

function MapBackgroundClickHandler({ onBackgroundClick }: { onBackgroundClick: () => void }) {
  useMapEvents({
    click: () => onBackgroundClick(),
  });
  return null;
}

function CompactMapMarker({
  position,
  icon,
  isSelected,
  onSelect,
  title,
  hint,
}: {
  position: [number, number];
  icon: L.DivIcon;
  isSelected: boolean;
  onSelect: () => void;
  title: string;
  hint: string;
}) {
  const markerRef = useRef<LeafletMarker>(null);

  useEffect(() => {
    markerRef.current?.setLatLng(position);
  }, [position]);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) {
      return;
    }
    if (isSelected) {
      marker.openPopup();
    } else {
      marker.closePopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={icon}
      eventHandlers={{
        click: (event) => {
          L.DomEvent.stopPropagation(event);
          onSelect();
        },
      }}
    >
      <Popup closeButton={false} maxWidth={200} minWidth={120} autoPan={false}>
        <div style={compactPopup.wrap}>
          <strong style={compactPopup.title}>{title}</strong>
          <span style={compactPopup.hint}>{hint}</span>
        </div>
      </Popup>
    </Marker>
  );
}

function RestaurantMapMarker({
  restaurant,
  isSelected,
  onSelect,
}: {
  restaurant: Restaurant;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <CompactMapMarker
      position={[restaurant.lat, restaurant.lng]}
      icon={categoryIcon(menuTypeColors[restaurant.menuType] ?? menuTypeColors['기타'])}
      isSelected={isSelected}
      onSelect={onSelect}
      title={restaurant.name}
      hint="↓ 아래에서 상세 보기"
    />
  );
}

function ResortMapMarker({
  resort,
  isSelected,
  onSelect,
}: {
  resort: MactanResort;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <CompactMapMarker
      position={[resort.lat, resort.lng]}
      icon={resortIcon}
      isSelected={isSelected}
      onSelect={onSelect}
      title={`🏨 ${resort.name}`}
      hint="↓ 아래에서 상세 보기"
    />
  );
}

function NightMarketMapMarker({
  market,
  isSelected,
  onSelect,
}: {
  market: NightMarket;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <CompactMapMarker
      position={[market.lat, market.lng]}
      icon={nightMarketIcon}
      isSelected={isSelected}
      onSelect={onSelect}
      title={`🎪 ${market.name}`}
      hint="↓ 아래에서 상세 보기"
    />
  );
}

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

  const center: [number, number] = [visiblePoints[0]!.lat, visiblePoints[0]!.lng];

  return (
    <View style={styles.wrap}>
      <View style={styles.mapBox}>
        <MapContainer
          key={`map-${showRestaurants ? 'r' : ''}${showResorts ? 's' : ''}${showNightMarkets ? 'n' : ''}`}
          center={center}
          zoom={12}
          style={webMapStyle}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {onClearMapSelection ? (
            <MapBackgroundClickHandler onBackgroundClick={onClearMapSelection} />
          ) : null}
          {showRestaurants &&
            restaurants.map((r) => (
              <RestaurantMapMarker
                key={`rest-${r.id}-${r.lat}-${r.lng}`}
                restaurant={r}
                isSelected={selectedRestaurantId === r.id}
                onSelect={() => onSelectRestaurant(r.id)}
              />
            ))}
          {showResorts &&
            resorts.map((resort) => (
              <ResortMapMarker
                key={`resort-${resort.id}-${resort.lat}-${resort.lng}`}
                resort={resort}
                isSelected={selectedResortId === resort.id}
                onSelect={() => onSelectResort(resort.id)}
              />
            ))}
          {showNightMarkets &&
            (nightMarkets ?? []).map((market) => (
              <NightMarketMapMarker
                key={`night-${market.id}-${market.lat}-${market.lng}`}
                market={market}
                isSelected={selectedNightMarketId === market.id}
                onSelect={() => onSelectNightMarket(market.id)}
              />
            ))}
          <MapFitBounds points={visiblePoints} />
          {showNightMarkets ? (
            <MapFocusNightMarket
              nightMarkets={nightMarkets}
              selectedNightMarketId={selectedNightMarketId}
            />
          ) : null}
        </MapContainer>
      </View>
    </View>
  );
}

const compactPopup: Record<string, CSSProperties> = {
  wrap: {
    margin: 0,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 12,
    lineHeight: 1.4,
    color: '#333',
    padding: '2px 0',
  },
  title: { display: 'block', fontSize: 13, marginBottom: 2 },
  hint: { display: 'block', fontSize: 11, color: '#5f6368' },
};

const webMapStyle: CSSProperties = {
  height: MAP_HEIGHT,
  width: '100%',
  borderRadius: 9,
  zIndex: 0,
};

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
});
