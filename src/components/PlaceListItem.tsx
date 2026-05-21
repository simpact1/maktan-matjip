import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getZoneLabel } from '../constants/filters';
import { guideStyles } from '../styles/guideStyles';
import { Restaurant } from '../types/restaurant';
import { getRestaurantLinks } from '../utils/restaurantLinks';

interface PlaceListItemProps {
  restaurant: Restaurant;
  isOpen: boolean;
  onToggle: () => void;
  onOpenLink: (url: string) => void;
}

export function PlaceListItem({
  restaurant,
  isOpen,
  onToggle,
  onOpenLink,
}: PlaceListItemProps) {
  const links = getRestaurantLinks(restaurant);

  const itemTags = useMemo(() => {
    const tags: {
      key: string;
      label: string;
      style: object;
      last?: boolean;
    }[] = [
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
        last: true,
      });
    }
    return tags;
  }, [restaurant]);

  return (
    <View style={guideStyles.item}>
      <Pressable
        style={guideStyles.itemBtn}
        onPress={onToggle}
        accessibilityRole="button"
        accessibilityState={{ expanded: isOpen }}
      >
        <View style={guideStyles.itemTitleRow}>
          <Text style={guideStyles.itemTitle}>{restaurant.name}</Text>
          <View style={guideStyles.itemTags}>
            {itemTags.map((tag) => (
              <Text
                key={tag.key}
                style={[
                  guideStyles.itemTag,
                  tag.style,
                  tag.last ? guideStyles.itemTagPickupLast : null,
                ]}
              >
                {tag.label}
              </Text>
            ))}
          </View>
        </View>
        <Text style={guideStyles.chev}>{isOpen ? '▲' : '▼'}</Text>
      </Pressable>
      {isOpen && (
        <View style={guideStyles.itemDetail}>
          <Text style={guideStyles.itemDesc}>{restaurant.desc}</Text>
          {links.length > 0 && (
            <View style={guideStyles.itemActions}>
              {links.map((link) => (
                <Pressable key={link.url} onPress={() => onOpenLink(link.url)}>
                  <Text style={guideStyles.itemLink}>{link.text} →</Text>
                </Pressable>
              ))}
            </View>
          )}
          {restaurant.pickupDrop && restaurant.pickupDropNote ? (
            <Text style={guideStyles.pickupNote}>
              🚌 {restaurant.pickupDropNote}
            </Text>
          ) : null}
        </View>
      )}
    </View>
  );
}
