import { useMemo } from 'react';
import { Text, View } from 'react-native';
import { getZoneLabel } from '../constants/filters';
import { colors, fonts } from '../constants/theme';
import { guideStyles } from '../styles/guideStyles';
import { Restaurant } from '../types/restaurant';
import { RestaurantDetailBody } from './RestaurantDetailBody';

interface RestaurantDetailSectionProps {
  restaurant: Restaurant;
  onOpenLink?: (url: string, title: string) => void;
}

export function RestaurantDetailSection({
  restaurant,
  onOpenLink,
}: RestaurantDetailSectionProps) {
  const itemTags = useMemo(() => {
    const tags: { key: string; label: string; style: object }[] = [
      {
        key: 'zone',
        label: `📍 ${getZoneLabel(restaurant.zone)}`,
        style: guideStyles.itemTagZone,
      },
      {
        key: 'menu',
        label: `🍽 ${restaurant.menuType}`,
        style: guideStyles.itemTagMenu,
      },
      {
        key: 'companion',
        label: `👥 ${restaurant.companionType}`,
        style: guideStyles.itemTagCompanion,
      },
    ];
    if (restaurant.pickupDrop) {
      tags.push({
        key: 'pickup',
        label: '🚌 픽업·드랍',
        style: guideStyles.itemTagPickup,
      });
    }
    return tags;
  }, [restaurant]);

  return (
    <View style={guideStyles.restaurantDetailSection}>
      <View style={guideStyles.restaurantDetailHeader}>
        <Text style={guideStyles.restaurantDetailTitle}>{restaurant.name}</Text>
        {restaurant.rating ? (
          <Text style={{
            fontSize: 12,
            color: '#fef9c3',
            fontFamily: fonts.regular,
            marginBottom: 6,
          }}>
            ⭐ {restaurant.rating} ({restaurant.ratingCount?.toLocaleString()}개 리뷰)
          </Text>
        ) : null}
        <View style={guideStyles.restaurantDetailTags}>
          {itemTags.map((tag) => (
            <Text key={tag.key} style={[guideStyles.itemTag, tag.style]}>
              {tag.label}
            </Text>
          ))}
        </View>
      </View>
      <View style={guideStyles.restaurantDetailBody}>
        <RestaurantDetailBody restaurant={restaurant} onOpenLink={onOpenLink} />
      </View>
    </View>
  );
}
