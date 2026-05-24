import { Pressable, Text, View } from 'react-native';
import { guideStyles } from '../styles/guideStyles';
import { Restaurant } from '../types/restaurant';
import { getRestaurantLinks } from '../utils/restaurantLinks';

interface RestaurantDetailBodyProps {
  restaurant: Restaurant;
  onOpenLink?: (url: string, title: string) => void;
}

export function RestaurantDetailBody({ restaurant, onOpenLink }: RestaurantDetailBodyProps) {
  const links = getRestaurantLinks(restaurant);

  return (
    <>
      <Text style={guideStyles.itemDesc}>{restaurant.desc}</Text>
      {links.length > 0 && onOpenLink ? (
        <View style={guideStyles.restaurantDetailLinks}>
          {links.map((link) => (
            <Pressable
              key={link.url}
              style={({ pressed }) => [
                guideStyles.resortBlogLinkBtn,
                pressed && guideStyles.resortBlogLinkBtnPressed,
              ]}
              onPress={() => onOpenLink(link.url, link.text)}
              accessibilityRole="link"
              accessibilityLabel={link.text}
            >
              <Text style={guideStyles.resortBlogLinkText}>{link.text}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {restaurant.pickupDrop && restaurant.pickupDropNote ? (
        <Text style={guideStyles.pickupNote}>🚌 {restaurant.pickupDropNote}</Text>
      ) : null}
    </>
  );
}
