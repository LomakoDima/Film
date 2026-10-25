import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, C, EIO, FONT, MONO, mix, prog, Rise, SkillChrome} from '../lib';

// Three real direction names from the skill's library (directions.json).
const CARDS = ['The pinned poster', 'Type and nothing else', 'The quiet instrument'];
const CW = 280;
const CH = 400;

const Sketch: React.FC<{i: number}> = ({i}) => {
  if (i === 0)
    return (
      <div style={{position: 'relative', height: 200}}>
        <div style={{position: 'absolute', left: 30, top: 24, width: 150, height: 170, background: C.ink, transform: 'rotate(-4deg)'}} />
        <div style={{position: 'absolute', left: 166, top: 18, width: 22, height: 22, borderRadius: 11, background: C.red}} />
      </div>
    );
  if (i === 1)
    return (
      <div style={{height: 200, fontFamily: FONT, fontWeight: 900, fontStretch: '62%', fontSize: 190, lineHeight: 1, color: C.ink, letterSpacing: '-0.04em', paddingLeft: 22}}>
        Aa
      </div>
    );
  return (
    <div style={{height: 200, padding: '30px 26px'}}>
      {[0, 1, 2, 3, 4].map((k) => (
        <div key={k} style={{height: 2, background: C.ink, marginBottom: 30, width: `${[100, 60, 85, 40, 70][k]}%`}} />
      ))}
    </div>
  );
};

// Mini "type and nothing else" page at a given width.
const MiniPage: React.FC<{w: number; h: number; scale: number; broken: boolean; kind: 0 | 1 | 2}> = ({w, h, scale, broken, kind}) => (
  <div style={{width: w, height: h, background: '#fff', position: 'relative', overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: 14 * scale, top: 18 * scale, fontFamily: FONT, fontWeight: 900, fontStretch: '62%', fontSize: 76 * scale, lineHeight: 0.95, color: C.ink, letterSpacing: '-0.03em', whiteSpace: kind === 0 && broken ? 'nowrap' : 'normal', width: w - 28 * scale}}>
      Words carry the whole page
    </div>
    {[0, 1, 2].map((k) => (
      <div
        key={k}
        style={{
          position: 'absolute',
          left: (kind === 1 && broken ? 34 : 14) * scale,
          right: 14 * scale,
          bottom: (20 + k * 16) * scale,
          height: 4 * scale,
          background: '#BDBDBD',
        }}
      />
    ))}
    {kind === 2 && broken && (
      <div style={{position: 'absolute', right: 14 * scale, top: 14 * scale, fontFamily: FONT, fontSize: 9 * scale, color: '#BDBDBD'}}>NEW</div>
    )}
  </div>
);

export const S4: React.FC = () => {
  const f = useCurrentFrame();
  const pick = prog(f, 50, 10);
  const out = prog(f, 72, 12, EIO);
  const frames = prog(f, 80, 14);
  const scan = prog(f, 96, 22, EIO);
  const fixed = f >= 126;

  // browser frames at three widths (1440 / 768 / 390), bottom aligned
  const FR = [
    {w: 480, h: 330, label: '1440', s: 1.15, kind: 2 as const},
    {w: 250, h: 330, label: '768', s: 0.85, kind: 1 as const},
    {w: 130, h: 260, label: '390', s: 0.5, kind: 0 as const},
  ];
  const gap = 38;
  const total = FR.reduce((a, b) => a + b.w, 0) + gap * 2;
  let x0 = 72 + (936 - total) / 2;
  const base = 1130;
  const marker = (k: number) => prog(f, 104 + k * 6, 6);

  return (
    <AbsoluteFill style={{background: C.ink}}>
      <SkillChrome
        n={4}
        name="Taste"
        by="by Leonxlnx"
        caption={['Deals an art direction, then', 'checks its work in a real browser.']}
        repo="github.com/Leonxlnx/taste-skill"
        dark
      />
      <Abs x={72} y={384}>
        <Rise key={f < 76 ? 'a' : f < 126 ? 'b' : 'c'} at={f < 76 ? 14 : f < 126 ? 84 : 126} dur={8}>
          <div style={{fontFamily: FONT, fontSize: 32, fontWeight: 600, color: f >= 126 ? C.red : C.grey}}>
            {f < 76 ? '3 of 20 researched directions, dealt' : f < 126 ? 'Checked at 3 widths, top 3 problems' : 'Fixed, then checked again'}
          </div>
        </Rise>
      </Abs>

      {/* dealt cards */}
      {CARDS.map((name, i) => {
        const deal = prog(f, 16 + i * 6, 14);
        const tx = 72 + (936 - (CW * 3 + 48)) / 2 + i * (CW + 24);
        const rot = [-5, 0, 5][i];
        const chosen = i === 1;
        const lift = chosen ? pick : 0;
        const dim = chosen ? 1 : mix(1, 0.3, pick);
        const flyY = out * (chosen ? -40 : 120);
        return (
          <Abs
            key={name}
            x={mix(540 - CW / 2, tx, deal)}
            y={mix(1300, 520, deal) - lift * 40 + flyY}
            w={CW}
            h={CH}
            style={{
              background: C.paper,
              transform: `rotate(${mix(0, rot, deal) * (1 - lift)}deg) scale(${1 + lift * 0.05})`,
              opacity: deal * dim * (1 - out),
              outline: chosen ? `${6 * pick}px solid ${C.red}` : 'none',
              outlineOffset: 8,
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
            }}
          >
            <Sketch i={i} />
            <div style={{position: 'absolute', left: 22, right: 22, bottom: 24, fontFamily: FONT, fontSize: 34, fontWeight: 700, fontStretch: '85%', lineHeight: 1.05, color: C.ink}}>
              {name}
            </div>
          </Abs>
        );
      })}

      {/* three widths */}
      {FR.map((fr, k) => {
        const x = x0;
        x0 += fr.w + gap;
        const p = prog(f, 80 + k * 4, 12);
        const m = marker(k);
        return (
          <React.Fragment key={fr.label}>
            <Abs
              x={x}
              y={base - fr.h}
              w={fr.w}
              h={fr.h}
              style={{
                border: '2px solid #444',
                borderTopWidth: 14,
                opacity: p * frames,
                transform: `translateY(${(1 - p) * 30}px)`,
                overflow: 'hidden',
              }}
            >
              <MiniPage w={fr.w - 4} h={fr.h - 16} scale={fr.s} broken={!fixed} kind={fr.kind} />
              {/* where the problem is */}
              {!fixed && m > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    border: `4px solid ${C.red}`,
                    opacity: m,
                    ...[
                      {left: 0, right: 0, top: 0, height: '42%'},
                      {left: 0, right: 0, bottom: 0, height: '30%'},
                      {right: 0, top: 0, width: '30%', height: '22%'},
                    ][fr.kind],
                  }}
                />
              )}
              {/* scan line */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  top: `${scan * 100}%`,
                  height: 3,
                  background: C.red,
                  opacity: scan > 0 && scan < 1 ? 1 : 0,
                }}
              />
            </Abs>
            <Abs x={x} y={base + 16} w={fr.w} style={{fontFamily: MONO, fontSize: 24, color: C.grey, textAlign: 'center', opacity: p}}>
              {fr.label}
            </Abs>
            {/* problem marker → check */}
            <Abs
              x={x + fr.w - 30}
              y={base - fr.h - 30}
              w={60}
              h={60}
              style={{
                borderRadius: 30,
                background: fixed ? C.paper : C.red,
                color: fixed ? C.ink : C.paper,
                fontFamily: FONT,
                fontWeight: 800,
                fontSize: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: m,
                transform: `scale(${mix(0.9, 1, m)})`,
              }}
            >
              {fixed ? '✓' : k + 1}
            </Abs>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
