"""세부 야시장 원고 검수 Streamlit 앱

실행:
  pip install streamlit
  streamlit run scripts/night_market_manuscript_review.py
"""

from __future__ import annotations

import re

import streamlit as st
import streamlit.components.v1 as components

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

NIGHT_MARKET_BLOG_LINKS: tuple[tuple[str, str, str], ...] = (
    ("세부 수그보 메르카도", "https://m.blog.naver.com/aalove0902/223355527596", "fa-solid fa-utensils"),
    ("세부 푸소 빌리지", "https://m.blog.naver.com/aalove0902/224281436285", "fa-solid fa-city"),
    ("막탄 메르카토", "https://m.blog.naver.com/aalove0902/223451364466", "fa-solid fa-tent"),
    ("막탄 푸드파크", "https://m.blog.naver.com/aalove0902/223311111355", "fa-solid fa-burger"),
)

NIGHT_MARKET_TOPIC_KEYWORDS = (
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
    return _normalize_for_match(SENTENCE_1) in normalized and _normalize_for_match(SENTENCE_2) in normalized


def diagnose_manuscript(body: str) -> dict[str, object]:
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


def render_reference_passage() -> None:
    st.info(REQUIRED_PASSAGE)


def render_night_market_map_links() -> None:
    st.subheader("야시장 생생 후기 블로그")
    cells: list[str] = []
    for label, url, icon_class in NIGHT_MARKET_BLOG_LINKS:
        cells.append(
            f'<a href="{url}" target="_blank" rel="noopener noreferrer" '
            'style="flex:1 1 0;min-width:0;display:flex;flex-direction:column;'
            'align-items:center;justify-content:center;text-align:center;'
            'padding:0.65rem 0.35rem;background:rgba(11,37,46,0.6);'
            'color:#ecfeff;border-radius:0.5rem;border:1px solid rgba(255,255,255,0.08);'
            'text-decoration:none;font-size:0.82rem;line-height:1.3;font-weight:700;'
            'cursor:pointer;gap:0.35rem;">'
            f'<i class="{icon_class}" '
            'style="font-size:1.05rem;color:#99f6e4;"></i>'
            f"<span>{label}</span></a>"
        )
    components.html(
        '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />'
        '<div style="display:flex;flex-direction:row;flex-wrap:nowrap;'
        'gap:0.4rem;width:100%;font-family:sans-serif;">'
        + "".join(cells)
        + "</div>",
        height=92,
        scrolling=False,
    )


def render_feedback(result: dict[str, object]) -> None:
    status = result["status"]

    if status == "empty":
        st.warning("검수할 원고 본문을 입력해 주세요.")
        return

    if status == "not_night_market":
        st.success("세부 야시장 관련 원고로 분류되지 않았습니다. (필수 문단 검수 대상 아님)")
        return

    if status == "ok":
        st.success("세부 야시장 필수 안내 문단이 본문에 포함되어 있습니다.")
        return

    if status == "missing_passage":
        st.error(
            "세부 야시장 관련 원고에서 아래 필수 안내 문단이 누락되었습니다. "
            "본문에 아래 원문을 보완하여 반영해 주세요."
        )
        render_reference_passage()
        return


def main() -> None:
    st.set_page_config(page_title="세부 야시장 원고 검수", page_icon="🌙", layout="wide")
    st.title("🌙 세부 야시장 원고 검수")
    st.caption("세부 야시장 관련 원고에 필수 안내 문단 포함 여부를 진단합니다.")

    render_night_market_map_links()

    with st.sidebar:
        st.subheader("필수 안내 문단 (원문)")
        render_reference_passage()

    body = st.text_area(
        "원고 본문",
        height=320,
        placeholder="세부 야시장 관련 원고 본문을 붙여 넣으세요.",
    )

    if st.button("검수 실행", type="primary"):
        result = diagnose_manuscript(body)
        render_feedback(result)

    with st.expander("예시 문단 (원문 그대로)"):
        render_reference_passage()


if __name__ == "__main__":
    main()
