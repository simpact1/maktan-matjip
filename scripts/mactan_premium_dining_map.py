"""막탄 11대 리조트 + 맛집 Folium 지도 (로컬 HTML 생성용)

사용법:
  pip install folium
  python scripts/mactan_premium_dining_map.py
"""

import json
from pathlib import Path

import folium

ROOT = Path(__file__).resolve().parent.parent
RESORTS_JSON = ROOT / "src" / "data" / "mactanResorts.json"
RESTAURANTS_JSON = ROOT / "src" / "data" / "restaurants.json"
OUTPUT_HTML = ROOT / "mactan_premium_dining_map.html"

m = folium.Map(location=[10.2950, 124.0020], zoom_start=13)

fg_restaurants = folium.FeatureGroup(name="세부 현지 맛집 (보유 리스트)")
fg_resorts = folium.FeatureGroup(name="막탄 주요 리조트 (조·석식 정보)", overlay=True)

mactan_resorts = json.loads(RESORTS_JSON.read_text(encoding="utf-8"))

for resort in mactan_resorts:
    popup_html = f"""
    <div style="width:320px;font-family:Malgun Gothic,sans-serif;font-size:13px;line-height:1.5;color:#333;">
        <div style="background:#1a73e8;color:white;padding:10px;border-radius:6px 6px 0 0;margin:-10px -10px 10px -10px;">
            <h4 style="margin:0;font-size:15px;">🏨 {resort["name"]}</h4>
        </div>
        <div style="padding:5px 0;">
            <strong style="color:#d93025;display:block;margin-bottom:3px;">🍳 조식 실전 가이드</strong>
            <span style="color:#5f6368;">{resort["breakfast"]}</span>
        </div>
        <hr style="border:0;border-top:1px solid #e8eaed;margin:8px 0;">
        <div style="padding:5px 0;">
            <strong style="color:#1e8e3e;display:block;margin-bottom:3px;">🍽️ 석식 다이닝/뷔페 팁</strong>
            <span style="color:#5f6368;">{resort["dinner"]}</span>
        </div>
    </div>
    """

    folium.Marker(
        location=[resort["lat"], resort["lng"]],
        popup=folium.Popup(popup_html, max_width=350),
        tooltip=f"🏨 {resort['name']} (조/석식 정보 보기)",
        icon=folium.Icon(color="darkblue", icon="hotel", prefix="fa"),
    ).add_to(fg_resorts)

restaurants = json.loads(RESTAURANTS_JSON.read_text(encoding="utf-8"))

for rest in restaurants:
    folium.Marker(
        location=[rest["lat"], rest["lng"]],
        popup=rest["name"],
        tooltip=f"🍖 {rest['name']}",
        icon=folium.Icon(color="orange", icon="cutlery", prefix="fa"),
    ).add_to(fg_restaurants)

fg_restaurants.add_to(m)
fg_resorts.add_to(m)
folium.LayerControl(collapsed=False).add_to(m)

m.save(OUTPUT_HTML)
print(f"🎉 막탄 다이닝 맵 빌드 완료: {OUTPUT_HTML}")
