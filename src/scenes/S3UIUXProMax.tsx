import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, C, EIO, FONT, MONO, mix, prog, SkillChrome, typed} from '../lib';

const SERIF = "'Cormorant Garamond', serif";
const SANS = "'Montserrat', sans-serif";

// Values from the project's own data files and README example.
const PRODUCTS = ['SaaS (General)', 'Fintech/Crypto', 'Gaming', 'E-commerce', 'Healthcare App', 'Creative Agency'];
const STYLES = ['Brutalism', 'Glassmorphism', 'Aurora UI', 'Bento Box Grid', 'Claymorphism', 'Neubrutalism', 'Y2K Aesthetic'];
const PALETTES = [
  ['#0F172A', '#22D3EE', '#F43F5E', '#F8FAFC', '#334155'],
  ['#14532D', '#FACC15', '#F97316', '#FEFCE8', '#1C1917'],
  ['#1E1B4B', '#A78BFA', '#34D399', '#F5F3FF', '#111827'],
  ['#7F1D1D', '#FCA5A5', '#FDE68A', '#FFF7ED', '#292524'],
];
const SPA = ['#E8B4B8', '#A8D5BA', '#D4AF37', '#FFF5F5', '#2D3436'];
const PAIRS = ['Space Grotesk / DM Sans', 'Playfair Display / Inter', 'Archivo Black / Roboto', 'Fira Code / Fira Sans'];

const ROW_Y = 580;
const ROW_H = 150;

type Row = {label: string; of: string; at: number};
const ROWS: Row[] = [
  {label: 'Product', of: '1 of 192 product types', at: 46},
  {label: 'Style', of: '1 of 79 searchable styles', at: 60},
  {label: 'Palette', of: '1 of 192 palettes', at: 74},
  {label: 'Type', of: '1 of 74 font pairings', at: 88},
];
const SPIN = 12;

const Swatches: React.FC<{cols: string[]}> = ({cols}) => (
  <div style={{display: 'flex', gap: 8}}>
    {cols.map((c, i) => (
      <div key={i} style={{width: 66, height: 66, background: c, border: '2px solid rgba(0,0,0,0.12)'}} />
    ))}
  </div>
);

export const S3: React.FC = () => {
  const f = useCurrentFrame();
  const value = (i: number) => {
    const r = ROWS[i];
    const settled = f >= r.at + SPIN;
    const k = Math.max(0, Math.floor((f - r.at) / 2));
    const big: React.CSSProperties = {fontFamily: FONT, fontSize: 50, fontWeight: 700, fontStretch: '85%', color: C.ink, whiteSpace: 'nowrap'};
    if (i === 0) return <div style={big}>{settled ? 'Beauty/Spa/Wellness Service' : PRODUCTS[k % PRODUCTS.length]}</div>;
    if (i === 1) return <div style={big}>{settled ? 'Soft UI Evolution' : STYLES[k % STYLES.length]}</div>;
    if (i === 2) return <Swatches cols={settled ? SPA : PALETTES[k % PALETTES.length]} />;
    return settled ? (
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18, color: C.ink}}>
        <span style={{fontFamily: SERIF, fontSize: 50, fontWeight: 600, whiteSpace: 'nowrap'}}>Cormorant Garamond</span>
        <span style={{fontFamily: SANS, fontSize: 28, fontWeight: 500, whiteSpace: 'nowrap'}}>+ Montserrat</span>
      </div>
    ) : (
      <div style={big}>{PAIRS[k % PAIRS.length]}</div>
    );
  };

  const preview = prog(f, 112, 16, EIO);

  return (
    <AbsoluteFill style={{background: C.paper}}>
      <SkillChrome
        n={3}
        name="UI UX Pro Max"
        by="by Next Level Builder"
        caption={['Turns a one-line brief into', 'a complete design system.']}
        repo="github.com/nextlevelbuilder/ui-ux-pro-max-skill"
      />
      {/* brief */}
      <Abs
        x={72}
        y={400}
        w={936}
        h={120}
        style={{
          border: `3px solid ${C.ink}`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 30px',
          fontFamily: FONT,
          fontSize: 40,
          fontWeight: 500,
          opacity: prog(f, 10, 8),
        }}
      >
        <span style={{fontFamily: MONO, color: C.red, marginRight: 18}}>›</span>
        {typed('A booking site for a calm spa', f, 16, 1.5)}
      </Abs>

      {/* reasoning rows */}
      {ROWS.map((r, i) => {
        const p = prog(f, r.at - 4, 8);
        const lock = f >= r.at + SPIN;
        return (
          <Abs
            key={r.label}
            x={72}
            y={ROW_Y + i * ROW_H}
            w={936}
            h={ROW_H}
            style={{
              borderTop: `2px solid ${C.ink}`,
              opacity: p * mix(1, 0, preview),
              transform: `translateY(${(1 - p) * 20}px)`,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{width: 270, flexShrink: 0}}>
              <div style={{fontFamily: FONT, fontSize: 32, fontWeight: 600, color: C.ink}}>{r.label}</div>
              <div style={{fontFamily: MONO, fontSize: 21, color: lock ? C.red : C.grey, marginTop: 8}}>{r.of}</div>
            </div>
            <div style={{opacity: lock ? 1 : 0.35}}>{value(i)}</div>
          </Abs>
        );
      })}

      {/* the generated system, applied */}
      <Abs
        x={72}
        y={580}
        w={936}
        h={740}
        style={{
          background: SPA[3],
          clipPath: `inset(0 0 ${(1 - preview) * 100}% 0)`,
          overflow: 'hidden',
        }}
      >
        <div style={{position: 'absolute', right: -120, top: 60, width: 480, height: 480, borderRadius: 240, background: SPA[0]}} />
        <div style={{position: 'absolute', right: 120, top: 330, width: 280, height: 280, borderRadius: 140, background: SPA[1]}} />
        <Abs x={60} y={70} w={620}>
          <div style={{fontFamily: SANS, fontSize: 24, fontWeight: 600, letterSpacing: '0.04em', color: SPA[4], opacity: prog(f, 122, 8)}}>
            Serenity Spa
          </div>
          <div
            style={{
              fontFamily: SERIF,
              fontSize: 150,
              fontWeight: 600,
              lineHeight: 0.92,
              color: SPA[4],
              marginTop: 30,
              opacity: prog(f, 124, 10),
              transform: `translateY(${(1 - prog(f, 124, 12)) * 30}px)`,
            }}
          >
            Breathe
            <br />
            out.
          </div>
          <div style={{fontFamily: SANS, fontSize: 28, lineHeight: 1.5, color: SPA[4], marginTop: 34, opacity: prog(f, 130, 10)}}>
            Massage, sauna and quiet rooms,
            <br />
            booked in two taps.
          </div>
          <div
            style={{
              marginTop: 44,
              display: 'inline-block',
              padding: '24px 44px',
              borderRadius: 40,
              background: SPA[2],
              color: '#fff',
              fontFamily: SANS,
              fontSize: 28,
              fontWeight: 600,
              opacity: prog(f, 134, 8),
            }}
          >
            Book a session
          </div>
        </Abs>
        <Abs x={60} y={650} style={{display: 'flex', gap: 10, opacity: prog(f, 138, 8)}}>
          {SPA.map((c) => (
            <div key={c} style={{fontFamily: MONO, fontSize: 18, color: SPA[4], display: 'flex', alignItems: 'center', gap: 8, marginRight: 14}}>
              <span style={{width: 22, height: 22, background: c, border: '1px solid rgba(0,0,0,.2)', display: 'inline-block'}} />
              {c}
            </div>
          ))}
        </Abs>
      </Abs>
    </AbsoluteFill>
  );
};
