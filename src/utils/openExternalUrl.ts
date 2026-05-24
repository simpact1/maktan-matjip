import { Linking, Platform } from 'react-native';

export function isExternalMapOrWebUrl(url: string): boolean {
  if (!/^https?:\/\//i.test(url)) return false;
  if (/naver\.com/i.test(url)) return false;
  return true;
}

export function openExternalUrl(url: string): void {
  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      return;
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    return;
  }

  Linking.openURL(url).catch(() => {
    // ignore — OS may reject unknown schemes
  });
}
