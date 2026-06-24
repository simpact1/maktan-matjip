const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });
const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

const restaurants = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../src/data/restaurants.json'), 'utf-8').replace(/^\uFEFF/, '')
);

async function fetchPlaceRating(name, lat, lng) {
  try {
    const searchUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=100&keyword=${encodeURIComponent(name)}&key=${API_KEY}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchData.results || searchData.results.length === 0) {
      return null;
    }

    const place = searchData.results[0];
    return {
      rating: place.rating || null,
      ratingCount: place.user_ratings_total || null,
      placeId: place.place_id || null,
    };
  } catch (e) {
    return null;
  }
}

async function main() {
  const results = [];
  const notFound = [];

  for (const r of restaurants) {
    console.log(`검색 중: ${r.name}`);
    const data = await fetchPlaceRating(r.name, r.lat, r.lng);

    if (data && data.rating) {
      results.push({ id: r.id, name: r.name, ...data });
      console.log(`  ✅ ${r.name}: ${data.rating} (${data.ratingCount}개)`);
    } else {
      notFound.push({ id: r.id, name: r.name, lat: r.lat, lng: r.lng });
      console.log(`  ❌ ${r.name}: 찾을 수 없음`);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));
  }

  fs.writeFileSync(
    path.join(__dirname, 'ratings_result.json'),
    JSON.stringify(results, null, 2)
  );

  fs.writeFileSync(
    path.join(__dirname, 'ratings_not_found.json'),
    JSON.stringify(notFound, null, 2)
  );

  console.log('\n=== 완료 ===');
  console.log(`찾음: ${results.length}개`);
  console.log(`못 찾음: ${notFound.length}개`);
}

main();
