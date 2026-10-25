import React from 'react';
import {INTER} from '../lib';

// The "average" AI landing page: Inter, purple-to-blue gradient,
// centered hero, pill button, three identical rounded cards.
export const GenericPage: React.FC<{w: number; h: number}> = ({w, h}) => {
  const s = w / 936;
  return (
    <div style={{width: w, height: h, overflow: 'hidden', position: 'relative', background: '#fff'}}>
      <div
        style={{
          width: 936,
          height: h / s,
          transform: `scale(${s})`,
          transformOrigin: 'top left',
          fontFamily: INTER,
        }}
      >
        <div
          style={{
            height: 470,
            background: 'linear-gradient(135deg, #7C3AED 0%, #4F46E5 50%, #3B82F6 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            color: '#fff',
            padding: '0 80px',
          }}
        >
          <div
            style={{
              fontSize: 22,
              padding: '8px 18px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.18)',
              marginBottom: 26,
            }}
          >
            ✨ Powered by AI
          </div>
          <div style={{fontSize: 66, fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.02em'}}>
            Build the future, faster
          </div>
          <div style={{fontSize: 26, marginTop: 20, color: 'rgba(255,255,255,0.75)'}}>
            The all-in-one platform for modern teams.
          </div>
          <div
            style={{
              marginTop: 34,
              padding: '18px 40px',
              borderRadius: 999,
              background: '#fff',
              color: '#4F46E5',
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Get started →
          </div>
        </div>
        <div style={{display: 'flex', gap: 24, padding: 36, background: '#F8FAFC'}}>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                flex: 1,
                height: 250,
                borderRadius: 20,
                background: '#fff',
                boxShadow: '0 6px 20px rgba(0,0,0,0.10)',
                padding: 26,
              }}
            >
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: 14,
                  background: 'linear-gradient(135deg,#A78BFA,#60A5FA)',
                }}
              />
              <div style={{height: 18, width: '70%', background: '#CBD5E1', borderRadius: 6, marginTop: 30}} />
              <div style={{height: 14, width: '90%', background: '#E2E8F0', borderRadius: 6, marginTop: 16}} />
              <div style={{height: 14, width: '60%', background: '#E2E8F0', borderRadius: 6, marginTop: 12}} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
