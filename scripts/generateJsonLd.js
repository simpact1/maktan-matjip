const fs = require('fs');
const path = require('path');

const restaurants = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/restaurants.json'), 'utf-8').replace(/^\uFEFF/, '')
);

const localBusinesses = restaurants
  .filter(r => r.rating && r.ratingCount)
  .map(r => ({
    "@type": "LocalBusiness",
    "name": r.name,
    "description": r.desc,
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": r.lat,
      "longitude": r.lng
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Cebu",
      "addressCountry": "PH"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": r.rating.toString(),
      "ratingCount": r.ratingCount.toString(),
      "bestRating": "5",
      "worstRating": "1"
    },
    "url": r.link || r.links?.[0]?.url || ""
  }));

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": localBusinesses
};

const scriptTag = `\n    <!-- JSON-LD: LocalBusiness 평점 -->\n    <script type="application/ld+json">\n    ${JSON.stringify(jsonLd, null, 2)}\n    </script>\n`;

// web/index.html 에서 </head> 바로 앞에 삽입
const htmlPath = path.join(__dirname, '../web/index.html');
let html = fs.readFileSync(htmlPath, 'utf-8');

// 기존 LocalBusiness 블록 제거 후 새로 삽입
html = html.replace(/\n    <!-- JSON-LD: LocalBusiness 평점 -->[\s\S]*?<\/script>\n/, '');
html = html.replace('  </head>', scriptTag + '  </head>');

fs.writeFileSync(htmlPath, html);
console.log(`✅ ${localBusinesses.length}개 레스토랑 LocalBusiness JSON-LD 생성 완료`);
