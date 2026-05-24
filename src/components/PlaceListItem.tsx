import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';
import { getZoneLabel } from '../constants/filters';
import { guideStyles } from '../styles/guideStyles';
import { Restaurant } from '../types/restaurant';

interface PlaceListItemProps {
  restaurant: Restaurant;
  isSelected: boolean;
  onSelect: () => void;
}

export function PlaceListItem({ restaurant, isSelected, onSelect }: PlaceListItemProps) {
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
    <View style={[guideStyles.item, isSelected && guideStyles.itemSelectedRestaurant]}>
      <Pressable
        style={guideStyles.itemBtn}
        onPress={onSelect}
        accessibilityRole="button"
        accessibilityLabel={restaurant.name}
        accessibilityState={{ selected: isSelected }}
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
        <Text style={guideStyles.chev}>{isSelected ? '●' : '›'}</Text>
      </Pressable>
    </View>
  );
}
