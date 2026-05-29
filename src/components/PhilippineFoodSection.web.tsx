import React, { type CSSProperties } from 'react';
import { PHILIPPINE_FOOD_ITEMS } from '../constants/philippineFoodItems';

type Props = {
  onOpenLink: (url: string, title: string) => void;
};

const wrap: CSSProperties = {
  width: '100%',
  maxWidth: '56rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingLeft: 16,
  paddingRight: 16,
  paddingTop: 8,
  paddingBottom: 8,
  backgroundColor: '#062d3d',
  color: '#ffffff',
  borderRadius: 8,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.25)',
  boxSizing: 'border-box',
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
};

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 8,
  width: '100%',
  boxSizing: 'border-box',
};

const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minWidth: 0,
  minHeight: 85,
  padding: 8,
  backgroundColor: '#0c4a60',
  border: '1px solid #176a84',
  borderRadius: 12,
  boxSizing: 'border-box',
  textDecoration: 'none',
  color: '#ffffff',
  transition: 'background-color 0.15s ease',
};

const iconWrap: CSSProperties = {
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: 4,
};

/**
 * 모바일 기본 10px → sm(640px) 12px → md(768px) 14px.
 * 실제 CSS 클래스로 강제하고 overflow:visible + nowrap을 주어,
 * 어떤 화면에서도 '필리핀 전통먹거리' 9글자가 '...'으로 잘리지 않는다.
 */
const LABEL_CSS = `
.ph-food-label{
  display:block;
  width:100%;
  min-width:0;
  text-align:center;
  font-weight:600;
  line-height:1.2;
  white-space:nowrap;
  overflow:visible;
  text-overflow:clip;
  font-size:10px;
}
@media (min-width:640px){.ph-food-label{font-size:12px;}}
@media (min-width:768px){.ph-food-label{font-size:14px;}}
`;

export function PhilippineFoodSection({ onOpenLink }: Props) {
  return (
    <div style={wrap}>
      <style>{LABEL_CSS}</style>
      <div style={{ marginBottom: 12 }}>
        <h2
          style={{
            fontSize: 16,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: 0,
          }}
        >
          <span aria-hidden>🍖</span> 필리핀 음식
        </h2>
      </div>

      <div style={grid}>
        {PHILIPPINE_FOOD_ITEMS.map((item) => (
          <a
            key={item.id}
            href={item.link}
            style={card}
            onClick={(e) => {
              e.preventDefault();
              onOpenLink(item.link, item.blogTitle);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#115b75';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0c4a60';
            }}
          >
            <span style={{ ...iconWrap, fontSize: 22 }} aria-hidden>
              {item.emoji}
            </span>
            <span className="ph-food-label">{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default PhilippineFoodSection;
