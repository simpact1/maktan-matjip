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
  const showReserve = restaurant.isCrab && restaurant.reservationLink;
  const showActionRow = onOpenLink && (links.length > 0 || showReserve);

  return (
    <>
      <Text style={guideStyles.itemDesc}>{restaurant.desc}</Text>
      {showActionRow ? (
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
          {showReserve ? (
            <Pressable
              style={({ pressed }) => [
                guideStyles.restaurantReserveBtn,
                pressed && guideStyles.restaurantReserveBtnPressed,
              ]}
              onPress={() => onOpenLink(restaurant.reservationLink!, '카카오톡 예약')}
              accessibilityRole="link"
              accessibilityLabel="예약하기"
              accessibilityHint={`${restaurant.name} 카카오톡 예약 상담`}
            >
              <Text style={guideStyles.restaurantReserveBtnText}>예약하기</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
      {restaurant.pickupDrop && restaurant.pickupDropNote ? (
        <Text style={guideStyles.pickupNote}>🚌 {restaurant.pickupDropNote}</Text>
      ) : null}
    </>
  );
}
