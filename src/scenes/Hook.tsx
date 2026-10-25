import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, C, EIO, FONT, mix, pop, prog, Rise} from '../lib';
import {GenericPage} from './Generic';

const TW = 296;
const TH = 300;
const GAP = 24;
const GX = 72;
const GY = 560;

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  const select = prog(f, 56, 8);
  const zoom = prog(f, 88, 17, EIO);

  const headline: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 104,
    fontWeight: 800,
    fontStretch: '78%',
    lineHeight: 0.98,
    letterSpacing: '-0.02em',
    wordSpacing: '0.06em',
    color: C.ink,
  };

  // Center tile (index 4) is the one we pick, then fly into.
  const cx = GX + (TW + GAP);
  const cy = GY + (TH + GAP);
  const zx = mix(cx, -40, zoom);
  const zy = mix(cy, -40, zoom);
  const zw = mix(TW, 1160, zoom);
  const zh = mix(TH, 2000, zoom);

  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Abs x={72} y={200} w={936}>
        <Rise at={0} out={60}>
          <div style={headline}>Ask an AI for</div>
        </Rise>
        <Rise at={4} out={62}>
          <div style={headline}>an interface.</div>
        </Rise>
        <Rise at={28} out={64}>
          <div style={{...headline, color: C.grey}}>Get the same one.</div>
        </Rise>
      </Abs>
      <Abs x={72} y={200} w={936}>
        <Rise at={66}>
          <div style={headline}>Unless it</div>
        </Rise>
        <Rise at={70}>
          <div style={headline}>
            has taste<span style={{color: C.red}}>.</span>
          </div>
        </Rise>
      </Abs>

      {Array.from({length: 9}).map((_, i) => {
        if (i === 4) return null;
        const col = i % 3;
        const row = Math.floor(i / 3);
        const s = pop(f, 8 + i * 3);
        const fade = mix(1, 0.12, select) * (1 - zoom);
        return (
          <Abs
            key={i}
            x={GX + col * (TW + GAP)}
            y={GY + row * (TH + GAP)}
            w={TW}
            h={TH}
            style={{
              ...s,
              opacity: s.opacity * fade,
              borderRadius: 14,
              overflow: 'hidden',
              border: '2px solid #E5E5E5',
              filter: `grayscale(${select})`,
            }}
          >
            <GenericPage w={TW} h={TH} />
          </Abs>
        );
      })}

      {/* the chosen one */}
      <Abs
        x={zx}
        y={zy}
        w={zw}
        h={zh}
        style={{
          ...pop(f, 8 + 4 * 3),
          borderRadius: mix(14, 0, zoom),
          overflow: 'hidden',
          border: zoom > 0 ? 'none' : '2px solid #E5E5E5',
          opacity: pop(f, 20).opacity * (1 - prog(f, 96, 8)),
        }}
      >
        <GenericPage w={zw} h={zh} />
      </Abs>
      {/* selection box, design-tool style */}
      <Abs
        x={cx - 10}
        y={cy - 10}
        w={TW + 20}
        h={TH + 20}
        style={{
          border: `4px solid ${C.red}`,
          opacity: select * (1 - zoom),
          transform: `scale(${mix(1.06, 1, select)})`,
        }}
      >
        {[
          [-12, -12],
          [TW + 4, -12],
          [-12, TH + 4],
          [TW + 4, TH + 4],
        ].map(([x, y], k) => (
          <div
            key={k}
            style={{position: 'absolute', left: x, top: y, width: 24, height: 24, background: C.red}}
          />
        ))}
      </Abs>
    </AbsoluteFill>
  );
};
