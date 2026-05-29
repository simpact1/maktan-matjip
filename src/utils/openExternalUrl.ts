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

/**
 * 새 탭을 열지 않고 현재 브라우저 창에서 그대로 이동한다.
 * (네이버 카페처럼 iframe 임베드는 막히지만 새 창 없이 현재 창 전환이 필요한 경우)
 * 사용자는 브라우저 뒤로가기로 앱으로 복귀할 수 있다.
 */
export function openUrlInSameWindow(url: string): void {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.location.href = url;
      return;
    }
  }

  Linking.openURL(url).catch(() => {
    // ignore — OS may reject unknown schemes
  });
}
