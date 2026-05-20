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
            {restaurant.pickupDrop && (
              <Text style={[guideStyles.itemTag, guideStyles.itemTagPickup]}>
                🚐 픽업·드랍
              </Text>
            )}
            {restaurant.resortMeal.includes('조식') && (
              <Text style={[guideStyles.itemTag, guideStyles.itemTagMealBreakfast]}>
                🌅 조식
              </Text>
            )}
            {restaurant.resortMeal.includes('석식') && (
              <Text style={[guideStyles.itemTag, guideStyles.itemTagMealDinner]}>
                🌙 석식
              </Text>
            )}
            <Text style={[guideStyles.itemTag, guideStyles.itemTagZone]}>
              {getZoneLabel(restaurant.zone)}
            </Text>
            <Text style={guideStyles.itemTag}>{restaurant.menuType}</Text>
            {restaurant.bestFor.map((tag) => (
              <Text key={tag} style={guideStyles.itemTag}>
                {tag}
              </Text>
            ))}
          </View>
        </View>
        <Text style={guideStyles.chev}>{isOpen ? '▲' : '▼'}</Text>
      </Pressable>
      {isOpen && (
        <View style={guideStyles.itemDetail}>
          <Text style={guideStyles.itemDesc}>{restaurant.desc}</Text>
          {restaurant.pickupDrop && restaurant.pickupDropNote ? (
            <Text style={guideStyles.pickupNote}>
              🚐 {restaurant.pickupDropNote}
            </Text>
          ) : null}
          {restaurant.resortMealNote ? (
            <Text style={guideStyles.mealNote}>
              🍳 {restaurant.resortMealNote}
            </Text>
          ) : null}
          {links.length > 0 && (
            <View style={guideStyles.itemActions}>
              {links.map((link) => (
                <Pressable key={link.url} onPress={() => onOpenLink(link.url)}>
                  <Text style={guideStyles.itemLink}>{link.text} →</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
