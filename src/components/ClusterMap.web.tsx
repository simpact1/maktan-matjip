import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useMemo, type CSSProperties } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts, MACTAN_CENTER, menuTypeColors } from '../constants/theme';
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

function MapFitAndFocus({
  points,
  focusedItemId,
  focusedResortId,
}: {
  points: MapPoint[];
  focusedItemId: string | null;
  focusedResortId: string | null;
}) {
  const map = useMap();
  const boundsKey = useMemo(() => points.map((p) => p.id).join('|'), [points]);

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

  useEffect(() => {
    const focusId = focusedResortId ?? focusedItemId;
    if (!focusId) {
      return;
    }
    const target = points.find((p) => p.id === focusId);
    if (!target) {
      return;
    }
    map.flyTo([target.lat, target.lng], 16, { duration: 0.45 });
  }, [map, focusedItemId, focusedResortId, points]);

  return null;
}

function blogUrl(restaurant: Restaurant): string | undefined {
  if (restaurant.link) {
    return restaurant.link;
  }
  return restaurant.links?.[0]?.url;
}

function ResortPopup({ resort }: { resort: MactanResort }) {
  return (
    <div style={resortPopup.wrap}>
      <div style={resortPopup.header}>
        <strong style={resortPopup.headerTitle}>🏨 {resort.name}</strong>
      </div>
      <div style={resortPopup.section}>
        <strong style={resortPopup.breakfastLabel}>🍳 조식 실전 가이드</strong>
        <p style={resortPopup.body}>{resort.breakfast}</p>
      </div>
      <hr style={resortPopup.hr} />
      <div style={resortPopup.section}>
        <strong style={resortPopup.dinnerLabel}>🍽️ 석식 다이닝/뷔페 팁</strong>
        <p style={resortPopup.body}>{resort.dinner}</p>
      </div>
    </div>
  );
}

export function ClusterMap({
  restaurants,
  resorts,
  showRestaurants,
  showResorts,
  focusedItemId,
  focusedResortId,
  onSelectRestaurant,
  onSelectResort,
}: ClusterMapProps) {
  const visiblePoints = useMemo(
    () => collectVisibleMapPoints(restaurants, resorts, showRestaurants, showResorts),
    [restaurants, resorts, showRestaurants, showResorts]
  );

  const mapKey = useMemo(
    () =>
      [
        showRestaurants ? restaurants.map((r) => r.id).join(',') : '',
        showResorts ? resorts.map((r) => r.id).join(',') : '',
      ].join('|'),
    [restaurants, resorts, showRestaurants, showResorts]
  );

  if (visiblePoints.length === 0) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.caption}>표시할 지도 레이어를 선택해 주세요.</Text>
      </View>
    );
  }

  const center: [number, number] = [visiblePoints[0]!.lat, visiblePoints[0]!.lng];

  return (
    <View style={styles.wrap}>
      <Text style={styles.caption}>
        🍖 맛집 · 🏨 리조트 레이어를 켜고 끌 수 있습니다. 리조트 마커를 탭하면 조식·석식
        가이드를 볼 수 있습니다.
      </Text>
      <View style={styles.mapBox}>
        <MapContainer
          key={mapKey}
          center={center}
          zoom={12}
          style={webMapStyle}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {showRestaurants &&
            restaurants.map((r) => (
              <Marker
                key={`rest-${r.id}`}
                position={[r.lat, r.lng]}
                icon={categoryIcon(
                  menuTypeColors[r.menuType] ?? menuTypeColors['기타']
                )}
                eventHandlers={{ click: () => onSelectRestaurant(r.id) }}
              >
                <Popup>
                  <div style={popupStyles.wrap}>
                    <strong style={popupStyles.title}>{r.name}</strong>
                    <p style={popupStyles.desc}>{r.desc}</p>
                    {blogUrl(r) ? (
                      <a href={blogUrl(r)} target="_blank" rel="noopener noreferrer" style={popupStyles.link}>
                        블로그 후기 보기
                      </a>
                    ) : null}
                  </div>
                </Popup>
              </Marker>
            ))}
          {showResorts &&
            resorts.map((resort) => (
              <Marker
                key={`resort-${resort.id}`}
                position={[resort.lat, resort.lng]}
                icon={resortIcon}
                eventHandlers={{ click: () => onSelectResort(resort.id) }}
              >
                <Popup maxWidth={350}>
                  <ResortPopup resort={resort} />
                </Popup>
              </Marker>
            ))}
          <MapFitAndFocus
            points={visiblePoints}
            focusedItemId={focusedItemId}
            focusedResortId={focusedResortId}
          />
        </MapContainer>
      </View>
    </View>
  );
}

const resortPopup: Record<string, CSSProperties> = {
  wrap: {
    margin: 0,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 13,
    lineHeight: 1.5,
    color: '#333',
    maxWidth: 320,
  },
  header: {
    background: '#1a73e8',
    color: '#fff',
    padding: 10,
    borderRadius: '6px 6px 0 0',
    margin: '-12px -12px 10px -12px',
  },
  headerTitle: { fontSize: 15 },
  section: { padding: '4px 0' },
  breakfastLabel: { color: '#d93025', display: 'block', marginBottom: 4 },
  dinnerLabel: { color: '#1e8e3e', display: 'block', marginBottom: 4 },
  body: { margin: 0, color: '#5f6368', fontSize: 12 },
  hr: { border: 0, borderTop: '1px solid #e8eaed', margin: '8px 0' },
};

const webMapStyle: CSSProperties = {
  height: MAP_HEIGHT,
  width: '100%',
  borderRadius: 9,
  zIndex: 0,
};

const popupStyles: Record<string, CSSProperties> = {
  wrap: {
    margin: 0,
    fontFamily: 'system-ui, sans-serif',
    fontSize: 13,
    lineHeight: 1.45,
    color: '#042f2e',
    maxWidth: 220,
  },
  title: { display: 'block', fontWeight: 700, marginBottom: 4 },
  desc: { margin: '0 0 8px', fontSize: 12, color: '#0f766e' },
  link: { color: '#0369a1', fontWeight: 600 },
};

const styles = StyleSheet.create({
  wrap: { marginBottom: 4 },
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
    touchAction: 'pan-y',
  } as const,
});
