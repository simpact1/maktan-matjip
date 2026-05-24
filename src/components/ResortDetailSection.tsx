import { Text, View } from 'react-native';
import { getZoneLabel } from '../constants/filters';
import { guideStyles } from '../styles/guideStyles';
import { MactanResort } from '../types/resort';
import { ResortDetailBody } from './ResortDetailBody';

interface ResortDetailSectionProps {
  resort: MactanResort;
  onOpenLink?: (url: string, title: string) => void;
}

export function ResortDetailSection({ resort, onOpenLink }: ResortDetailSectionProps) {
  return (
    <View style={guideStyles.resortDetailSection}>
      <View style={guideStyles.resortDetailHeader}>
        <Text style={guideStyles.resortDetailTitle}>🏨 {resort.name}</Text>
        <Text style={guideStyles.resortDetailZone}>📍 {getZoneLabel(resort.zone)}</Text>
      </View>
      <View style={guideStyles.resortDetailBody}>
        <ResortDetailBody resort={resort} onOpenLink={onOpenLink} />
      </View>
    </View>
  );
}
