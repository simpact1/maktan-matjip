"""세부/막탄 야시장 원고 검수 + 구글맵·블로그 4열 바로가기 Streamlit 앱

실행:
  pip install -r requirements-streamlit.txt
  streamlit run app.py
"""

from __future__ import annotations

import html
import re

import streamlit as st
import streamlit.components.v1 as components

# ---------------------------------------------------------------------------
# 필수 안내 문단 (원문 — 임의 수정 금지)
# ---------------------------------------------------------------------------

SENTENCE_1 = (
    "한국인들이 흔히 떠올리는 대만이나 태국의 야시장(기념품·잡화 쇼핑 중심)과 달리, "
    "세부 야시장은 주로 '현지식 먹거리 위주의 푸드코트 형태'라는 점이 가장 큰 차이점입니다."
)
SENTENCE_2 = (
    "또한 막탄 지역은 야시장 규모가 작고 활성화가 덜 되어 있어, "
    "제대로 된 야시장 투어와 다채로운 미식을 즐기려면 대다수의 여행객이 "
    "세부 시티(IT파크 등)에 있는 대형 야시장으로 이동하는 편입니다."
)

REQUIRED_PASSAGE = f"{SENTENCE_1}\n{SENTENCE_2}"

# ---------------------------------------------------------------------------
# 야시장 구글맵 4열 (좌표 기반 — 단축 URL 만료 방지)
# ---------------------------------------------------------------------------

NIGHT_MARKET_GOOGLE_MAP_LINKS: tuple[tuple[str, str], ...] = (
    (
        "수그보 메르카도 IT파크점",
        "https://www.google.com/maps/search/?api=1&query=10.3292,123.9061",
    ),
    (
        "메르카도 드 막탄",
        "https://www.google.com/maps/search/?api=1&query=10.297,124.0155",
    ),
    (
        "막탄 푸드파크",
        "https://www.google.com/maps/search/?api=1&query=10.2645,123.981",
    ),
    (
        "세부시티 야시장 검색",
        "https://www.google.com/maps/search/?api=1&query=night+market+in+Cebu+City",
    ),
)

# ---------------------------------------------------------------------------
# 야시장 생생 후기 블로그 4열 (모바일 m.blog)
# ---------------------------------------------------------------------------

NIGHT_MARKET_BLOG_LINKS: tuple[tuple[str, str, str], ...] = (
    (
        "세부 수그보 메르카도",
        "https://m.blog.naver.com/aalove0902/223355527596",
        "fa-solid fa-utensils",
    ),
    (
        "세부 푸소 빌리지",
        "https://m.blog.naver.com/aalove0902/224281436285",
        "fa-solid fa-city",
    ),
    (
        "막탄 메르카토",
        "https://m.blog.naver.com/aalove0902/223451364466",
        "fa-solid fa-tent",
    ),
    (
        "막탄 푸드파크",
        "https://m.blog.naver.com/aalove0902/223311111355",
        "fa-solid fa-burger",
    ),
)

# ---------------------------------------------------------------------------
# 야시장 원고 진단 키워드
# ---------------------------------------------------------------------------

NIGHT_MARKET_TOPIC_KEYWORDS: tuple[str, ...] = (
    "세부 야시장",
    "세부야시장",
    "막탄 야시장",
    "수그보",
    "sugbo",
    "푸소 빌리지",
    "puso village",
    "food camp",
    "mercado de mactan",
    "메르카토",
    "푸드캠프",
)


def _normalize_for_match(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip())


def is_night_market_manuscript(body: str) -> bool:
    lowered = body.lower()
    return any(keyword.lower() in lowered for keyword in NIGHT_MARKET_TOPIC_KEYWORDS)


def is_required_passage_present(body: str) -> bool:
    normalized = _normalize_for_match(body)
    return (
        _normalize_for_match(SENTENCE_1) in normalized
        and _normalize_for_match(SENTENCE_2) in normalized
    )


def diagnose_manuscript(body: str) -> dict[str, object]:
    """세부/막탄 야시장 원고 진단."""
    if not body.strip():
        return {
            "status": "empty",
            "is_night_market": False,
            "passage_present": False,
        }

    is_night_market = is_night_market_manuscript(body)
    passage_present = is_required_passage_present(body)

    if not is_night_market:
        return {
            "status": "not_night_market",
            "is_night_market": False,
            "passage_present": passage_present,
        }

    if passage_present:
        return {
            "status": "ok",
            "is_night_market": True,
            "passage_present": True,
        }

    return {
        "status": "missing_passage",
        "is_night_market": True,
        "passage_present": False,
    }


def _render_four_column_link_row(
    links: tuple[tuple[str, ...], ...],
    *,
    icon_prefix: str = "📍",
    accent_color: str = "#99f6e4",
    row_height: int = 92,
) -> None:
    """모바일·PC 모두 한 줄 4열(flex nowrap)로 링크 버튼 렌더링."""
    cells: list[str] = []
    for item in links:
        label = html.escape(item[0])
        url = html.escape(item[1])
        icon_html = ""
        if len(item) >= 3:
            icon_class = html.escape(item[2])
            icon_html = (
                f'<i class="{icon_class}" '
                f'style="font-size:1.05rem;color:{accent_color};"></i>'
            )
        else:
            icon_html = (
                f'<span style="font-size:1.05rem;color:{accent_color};">'
                f"{icon_prefix}</span>"
            )

        cells.append(
            f'<a href="{url}" target="_blank" rel="noopener noreferrer" '
            'style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;'
            'align-items:center;justify-content:center;text-align:center;'
            'padding:0.65rem 0.35rem;background:rgba(11,37,46,0.6);'
            'color:#ecfeff;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.08);'
            'text-decoration:none;font-size:0.82rem;line-height:1.3;font-weight:700;'
            f'cursor:pointer;gap:0.35rem;">'
            f"{icon_html}<span>{label}</span></a>"
        )

    fontawesome_cdn = ""
    if any(len(item) >= 3 for item in links):
        fontawesome_cdn = (
            '<link rel="stylesheet" '
            'href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />'
        )

    components.html(
        fontawesome_cdn
        + '<div style="display:flex;flex-direction:row;flex-wrap:nowrap;'
        'gap:0.4rem;width:100%;font-family:sans-serif;">'
        + "".join(cells)
        + "</div>",
        height=row_height,
        scrolling=False,
    )


def render_night_market_google_map_links() -> None:
    st.subheader("🗺️ 야시장 구글 맵 (4열)")
    st.caption("한 줄 4개 — 터치 시 Google Maps 새 창에서 열립니다.")
    _render_four_column_link_row(NIGHT_MARKET_GOOGLE_MAP_LINKS, icon_prefix="📍")


def render_night_market_blog_links() -> None:
    st.subheader("📝 야시장 생생 후기 블로그 (4열)")
    st.caption("한 줄 4개 — 터치 시 모바일 네이버 블로그 새 창에서 열립니다.")
    _render_four_column_link_row(NIGHT_MARKET_BLOG_LINKS)


def render_reference_passage() -> None:
    st.info(REQUIRED_PASSAGE)


def render_feedback(result: dict[str, object]) -> None:
    status = result["status"]

    if status == "empty":
        st.warning("검수할 원고 본문을 입력해 주세요.")
        return

    if status == "not_night_market":
        st.success("세부 야시장 관련 원고로 분류되지 않았습니다. (필수 문단 검수 대상 아님)")
        return

    if status == "ok":
        st.success("✅ 세부 야시장 필수 안내 문단이 본문에 포함되어 있습니다.")
        return

    if status == "missing_passage":
        st.error(
            "❌ 세부 야시장 관련 원고에서 아래 필수 안내 문단이 누락되었습니다. "
            "본문에 아래 원문을 보완하여 반영해 주세요."
        )
        render_reference_passage()
        return


def main() -> None:
    st.set_page_config(
        page_title="세부/막탄 야시장 가이드 & 원고 검수",
        page_icon="🌙",
        layout="wide",
    )
    st.title("🌙 세부/막탄 야시장 가이드 & 원고 검수")
    st.caption(
        "야시장 구글맵·블로그 4열 바로가기 + 세부 야시장 원고 필수 문단 진단"
    )

    render_night_market_google_map_links()
    st.divider()
    render_night_market_blog_links()
    st.divider()

    with st.sidebar:
        st.subheader("📋 필수 안내 문단 (원문)")
        render_reference_passage()
        st.markdown("---")
        st.subheader("🔍 진단 키워드")
        st.code("\n".join(NIGHT_MARKET_TOPIC_KEYWORDS), language=None)

    st.subheader("✍️ 원고 검수")
    body = st.text_area(
        "원고 본문",
        height=320,
        placeholder="세부/막탄 야시장 관련 원고 본문을 붙여 넣으세요.",
        key="manuscript_body",
    )

    col_run, col_clear = st.columns([1, 1])
    with col_run:
        run_clicked = st.button("검수 실행", type="primary", use_container_width=True)
    with col_clear:
        if st.button("입력 초기화", use_container_width=True):
            st.session_state["manuscript_body"] = ""
            st.rerun()

    if run_clicked:
        result = diagnose_manuscript(body)
        st.markdown("---")
        st.subheader("검수 결과")
        render_feedback(result)

        with st.expander("진단 상세"):
            st.json(result)

    with st.expander("예시 문단 (필수 안내 원문)"):
        render_reference_passage()


if __name__ == "__main__":
    main()
