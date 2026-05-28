import React, { type CSSProperties } from 'react';
import {
  PHILIPPINE_FOOD_ITEMS,
  PHILIPPINE_FOOD_SUBTITLE,
} from '../constants/philippineFoodItems';

type Props = {
  onOpenLink: (url: string, title: string) => void;
};

const wrap: CSSProperties = {
  width: '100%',
  maxWidth: '56rem',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: 16,
  backgroundColor: '#062d3d',
  color: '#ffffff',
  borderRadius: 8,
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.25)',
  fontFamily:
    'system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans KR", sans-serif',
};

const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
  gap: 8,
  width: '100%',
};

const card: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 8,
  backgroundColor: '#0c4a60',
  border: '1px solid #176a84',
  borderRadius: 12,
  minHeight: 90,
  aspectRatio: '1',
  textDecoration: 'none',
  color: '#ffffff',
  transition: 'background-color 0.15s ease',
};

const cardLabel: CSSProperties = {
  width: '100%',
  textAlign: 'center',
  fontWeight: 600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  fontSize: 'clamp(9px, 2.5vw, 14px)',
};

export function PhilippineFoodSection({ onOpenLink }: Props) {
  return (
    <div style={wrap}>
      <div style={{ marginBottom: 16 }}>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            margin: 0,
          }}
        >
          <span aria-hidden>🍖</span> 필리핀 음식
        </h2>
        <p
          style={{
            fontSize: 12,
            color: '#d1d5db',
            marginTop: 4,
            marginBottom: 0,
          }}
        >
          {PHILIPPINE_FOOD_SUBTITLE}
        </p>
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
            <span style={{ fontSize: 24, marginBottom: 4 }} aria-hidden>
              {item.emoji}
            </span>
            <span style={cardLabel}>{item.title}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default PhilippineFoodSection;
