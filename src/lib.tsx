import React from 'react';
import {Easing, interpolate, useCurrentFrame} from 'remotion';

export const C = {
  ink: '#000000',
  paper: '#FFFFFF',
  red: '#F01E14',
  grey: '#8C8C8C',
  greyDark: '#5E5E5E',
  rule: '#E4E4E4',
  ruleDark: '#262626',
};

export const FONT = "'Archivo Variable', sans-serif";
export const MONO = "'JetBrains Mono', monospace";
export const INTER = "'Inter Variable', 'Inter', sans-serif";

// The film obeys the curves it teaches (emil-design-eng).
export const EO = Easing.bezier(0.23, 1, 0.32, 1); // strong ease-out
export const EIO = Easing.bezier(0.77, 0, 0.175, 1); // strong ease-in-out

export const prog = (f: number, start: number, dur: number, ease = EO) =>
  interpolate(f, [start, start + dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

export const typed = (text: string, f: number, start: number, cps = 1.4) =>
  text.slice(0, Math.max(0, Math.floor((f - start) * cps)));

// Line that slides up out of a mask.
export const Rise: React.FC<{
  at: number;
  dur?: number;
  out?: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({at, dur = 12, out, children, style}) => {
  const f = useCurrentFrame();
  const p = prog(f, at, dur);
  const q = out === undefined ? 0 : prog(f, out, 10, EIO);
  return (
    <div style={{overflow: 'hidden', paddingBottom: '0.08em', ...style}}>
      <div
        style={{
          transform: `translateY(${(1 - p) * 105 - q * 105}%)`,
          opacity: p > 0 ? 1 : 0,
        }}
      >
        {children}
      </div>
    </div>
  );
};

// Pop-in that never starts from scale(0).
export const pop = (f: number, at: number, dur = 7) => {
  const p = prog(f, at, dur);
  return {opacity: p, transform: `scale(${mix(0.92, 1, p)})`};
};

export const Abs: React.FC<{
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({x = 0, y = 0, w, h, style, children}) => (
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, ...style}}>
    {children}
  </div>
);

export const Browser: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  url: string;
  dark?: boolean;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x, y, w, h, url, dark, children, style}) => {
  const frame = dark ? '#1C1C1C' : '#F0F0F0';
  const border = dark ? '#333' : '#D6D6D6';
  return (
    <Abs
      x={x}
      y={y}
      w={w}
      h={h}
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        border: `2px solid ${border}`,
        background: dark ? '#000' : '#fff',
        ...style,
      }}
    >
      <div
        style={{
          height: 60,
          background: frame,
          display: 'flex',
          alignItems: 'center',
          padding: '0 22px',
          gap: 12,
          borderBottom: `2px solid ${border}`,
        }}
      >
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{width: 16, height: 16, borderRadius: 8, background: dark ? '#444' : '#C9C9C9'}}
          />
        ))}
        <div
          style={{
            marginLeft: 18,
            flex: 1,
            height: 34,
            borderRadius: 8,
            background: dark ? '#0d0d0d' : '#fff',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            fontFamily: MONO,
            fontSize: 20,
            color: dark ? '#9a9a9a' : '#7a7a7a',
          }}
        >
          {url}
        </div>
      </div>
      <div style={{position: 'absolute', left: 0, top: 62, right: 0, bottom: 0, overflow: 'hidden'}}>
        {children}
      </div>
    </Abs>
  );
};

// Shared chapter chrome: index square, name, author, caption, repo.
export const SkillChrome: React.FC<{
  n: number;
  name: string;
  by: string;
  caption: string[];
  repo: string;
  dark?: boolean;
}> = ({n, name, by, caption, repo, dark}) => {
  const f = useCurrentFrame();
  const fg = dark ? C.paper : C.ink;
  return (
    <>
      <Abs x={72} y={214} w={36} h={36} style={{background: C.red}} />
      <Abs x={936} y={208} w={72} style={{textAlign: 'right'}}>
        <div style={{fontFamily: MONO, fontSize: 28, color: C.grey, ...{opacity: prog(f, 16, 8)}}}>
          {n}/5
        </div>
      </Abs>
      <Abs x={132} y={176}>
        <Rise at={14}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 86,
              fontWeight: 800,
              fontStretch: '82%',
              letterSpacing: '-0.02em',
              lineHeight: 1,
              color: fg,
              whiteSpace: 'nowrap',
            }}
          >
            {name}
          </div>
        </Rise>
        <Rise at={19}>
          <div style={{fontFamily: FONT, fontSize: 34, fontWeight: 500, color: C.grey, marginTop: 8}}>
            {by}
          </div>
        </Rise>
      </Abs>
      <Abs x={72} y={1384} w={936}>
        {caption.map((line, i) => (
          <Rise key={i} at={34 + i * 4}>
            <div
              style={{
                fontFamily: FONT,
                fontSize: 54,
                fontWeight: 700,
                fontStretch: '88%',
                letterSpacing: '-0.015em',
                lineHeight: 1.08,
                color: fg,
              }}
            >
              {line}
            </div>
          </Rise>
        ))}
        <div
          style={{
            marginTop: 26,
            fontFamily: MONO,
            fontSize: 26,
            color: C.grey,
            opacity: prog(f, 46, 10),
          }}
        >
          {repo}
        </div>
      </Abs>
    </>
  );
};

// Thin film-progress rule, top of frame.
export const Progress: React.FC<{global: number}> = ({global}) => {
  const p = interpolate(global, [180, 1020], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <Abs x={72} y={140} w={936} h={4} style={{background: 'rgba(140,140,140,0.35)'}}>
      <div style={{width: `${p * 100}%`, height: '100%', background: C.red}} />
    </Abs>
  );
};
