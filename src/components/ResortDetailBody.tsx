import { Pressable, Text, View } from 'react-native';
import { guideStyles } from '../styles/guideStyles';
import { MactanResort } from '../types/resort';
import { openExternalUrl } from '../utils/openExternalUrl';

interface ResortDetailBodyProps {
  resort: MactanResort;
  onOpenLink?: (url: string, title: string) => void;
}

function getValidReviewLinks(resort: MactanResort) {
  return (resort.reviewLinks ?? []).filter(
    (link) => link.label.trim().length > 0 && link.url.trim().length > 0,
  );
}

export function ResortDetailBody({ resort, onOpenLink }: ResortDetailBodyProps) {
  const reviewLinks = getValidReviewLinks(resort);

  return (
    <>
      <Text style={guideStyles.resortMealBlock}>
        <Text style={guideStyles.resortMealLabel}>🍳 아침 식사 가이드{'\n'}</Text>
        {resort.breakfast}
      </Text>
      <Text style={guideStyles.resortMealBlock}>
        <Text style={guideStyles.resortMealLabel}>🍽️ 저녁 식사 가이드{'\n'}</Text>
        {resort.dinner}
      </Text>
      {reviewLinks.length > 0 ? (
        <View style={guideStyles.resortReviewLinkWrap}>
          {reviewLinks.map((link) => (
            <Pressable
              key={link.url}
              style={({ pressed }) => [
                guideStyles.resortBlogLinkBtn,
                guideStyles.resortReviewLinkBtn,
                pressed && guideStyles.resortBlogLinkBtnPressed,
              ]}
              onPress={() => openExternalUrl(link.url)}
              accessibilityRole="link"
              accessibilityLabel={link.label}
            >
              <Text style={guideStyles.resortBlogLinkText}>{link.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
      {resort.blogLink && onOpenLink ? (
        <View style={guideStyles.resortBlogLinkWrap}>
          <Pressable
            style={({ pressed }) => [
              guideStyles.resortBlogLinkBtn,
              pressed && guideStyles.resortBlogLinkBtnPressed,
            ]}
            onPress={() => onOpenLink(resort.blogLink!.url, resort.blogLink!.label)}
            accessibilityRole="link"
            accessibilityLabel={resort.blogLink.label}
          >
            <Text style={guideStyles.resortBlogLinkText}>{resort.blogLink.label}</Text>
          </Pressable>
        </View>
      ) : null}
      {resort.otherVenues.length > 0 ? (
        <View style={guideStyles.resortOtherBlock}>
          <Text style={guideStyles.resortOtherTitle}>🍴 리조트 내 레스토랑</Text>
          {resort.otherVenues.map((venue) => (
            <Text key={venue.name} style={guideStyles.resortOtherItem}>
              <Text style={guideStyles.resortOtherName}>· {venue.name}</Text>
              {' — '}
              {venue.summary}
            </Text>
          ))}
        </View>
      ) : null}
    </>
  );
}
