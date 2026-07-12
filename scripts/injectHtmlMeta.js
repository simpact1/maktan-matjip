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

const injected = distHtml
  .replace('</head>', `\n  ${customHeadContent}\n  </head>`)
  .replace('<html lang="en">', '<html lang="ko">');

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

// robots.txt 파일을 dist 폴더로 복사
const robotsSrc = path.join(__dirname, '../public/robots.txt');
const robotsDest = path.join(__dirname, '../dist/robots.txt');
if (fs.existsSync(robotsSrc)) {
  fs.copyFileSync(robotsSrc, robotsDest);
  console.log('✅ robots.txt dist 폴더로 복사 완료');
}

// llms.txt 파일을 dist 폴더로 복사
const llmsSrc = path.join(__dirname, '../public/llms.txt');
const llmsDest = path.join(__dirname, '../dist/llms.txt');
if (fs.existsSync(llmsSrc)) {
  fs.copyFileSync(llmsSrc, llmsDest);
  console.log('✅ llms.txt dist 폴더로 복사 완료');
}

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const restaurantsPath = path.join(__dirname, '../src/data/restaurants.json');
const restaurants = JSON.parse(fs.readFileSync(restaurantsPath, 'utf-8'));

const articleBlocks = restaurants
  .map(
    ({ name, zone, menuType, desc }) => `    <article>
      <h3>${escapeHtml(name)}</h3>
      <p>지역: ${escapeHtml(zone)} · 메뉴: ${escapeHtml(menuType)}</p>
      <p>${escapeHtml(desc)}</p>
    </article>`
  )
  .join('\n');

const seoSection = `<section id="matzip-seo-list" aria-label="세부 막탄 맛집 목록">
  <h2>세부 막탄 맛집 가이드</h2>
${articleBlocks}
</section>`;

let distHtmlWithSeo = fs.readFileSync(distHtmlPath, 'utf-8');
const rootRegex = /(<div\s+id="root"[^>]*>)([\s\S]*?)(<\/div>)/i;
const rootMatch = distHtmlWithSeo.match(rootRegex);

if (rootMatch && rootMatch[2].trim() === '') {
  distHtmlWithSeo = distHtmlWithSeo.replace(
    rootRegex,
    `$1\n${seoSection}\n  $3`
  );
  fs.writeFileSync(distHtmlPath, distHtmlWithSeo);
  console.log(`✅ ${restaurants.length}개 맛집 목록을 #root에 삽입 완료`);
}
