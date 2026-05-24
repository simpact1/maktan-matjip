/**
 * PC 네이버 블로그 URL을 모바일 웹(m.blog.naver.com) 주소로 변환한다.
 * 이미 m.blog 도메인이면 그대로 반환한다.
 */
export function toMobileNaverBlogUrl(url: string): string {
  if (!url.includes('//blog.naver.com')) {
    return url;
  }
  return url.replace(/\/\/blog\.naver\.com/g, '//m.blog.naver.com');
}
