const fs = require('fs');
const path = require('path');

const distHtmlPath = path.join(__dirname, '../dist/index.html');
const customHtmlPath = path.join(__dirname, '../web/index.html');

if (!fs.existsSync(distHtmlPath)) {
  console.error('❌ dist/index.html 없음. 먼저 expo export 실행해주세요.');
  process.exit(1);
}

const distHtml = fs.readFileSync(distHtmlPath, 'utf-8');
const customHtml = fs.readFileSync(customHtmlPath, 'utf-8');

const customHeadMatch = customHtml.match(/<head>([\s\S]*?)<\/head>/);
if (!customHeadMatch) {
  console.error('❌ web/index.html에서 <head> 추출 실패');
  process.exit(1);
}

const customHeadContent = customHeadMatch[1]
  .replace(/<meta charset[\s\S]*?\/>/g, '')
  .replace(/<meta httpEquiv[\s\S]*?\/>/g, '')
  .replace(/<meta name="viewport"[\s\S]*?\/>/g, '')
  .trim();

const injected = distHtml.replace('</head>', `\n  ${customHeadContent}\n  </head>`);

fs.writeFileSync(distHtmlPath, injected);
console.log('✅ dist/index.html에 메타태그/JSON-LD 삽입 완료');

// og-image 파일을 dist 폴더로 복사
const ogImageSrc = path.join(__dirname, '../web/og-image-final.jpg');
const ogImageDest = path.join(__dirname, '../dist/og-image-final.jpg');
if (fs.existsSync(ogImageSrc)) {
  fs.copyFileSync(ogImageSrc, ogImageDest);
  console.log('✅ og-image-final.jpg dist 폴더로 복사 완료');
} else {
  console.log('❌ og-image-final.jpg 파일을 web/ 폴더에서 찾을 수 없음');
}

// sitemap.xml 파일을 dist 폴더로 복사
const sitemapSrc = path.join(__dirname, '../web/sitemap.xml');
const sitemapDest = path.join(__dirname, '../dist/sitemap.xml');
if (fs.existsSync(sitemapSrc)) {
  fs.copyFileSync(sitemapSrc, sitemapDest);
  console.log('✅ sitemap.xml dist 폴더로 복사 완료');
}
