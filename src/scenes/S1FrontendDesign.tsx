import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, Browser, C, EIO, FONT, mix, prog, Rise, SkillChrome} from '../lib';
import {GenericPage} from './Generic';

const BX = 72;
const BY = 430;
const BW = 936;
const BH = 880;
const IW = BW - 4;
const IH = BH - 66;

const PLAN: [string, React.ReactNode][] = [
  ['Subject', 'Overnight train, Almaty to Astana'],
  [
    'Colour',
    <div key="c" style={{display: 'flex', gap: 10}}>
      {['#000000', '#FFFFFF', C.red, '#BDBDBD'].map((c) => (
        <div key={c} style={{width: 56, height: 56, background: c, border: '2px solid #000'}} />
      ))}
    </div>,
  ],
  ['Type', 'One family, condensed, heavy'],
  ['Hero', 'The departure time, huge'],
];

export const S1: React.FC = () => {
  const f = useCurrentFrame();
  const genericIn = prog(f, 12, 10);
  const genericOut = prog(f, 64, 12, EIO);
  const planOut = prog(f, 110, 10, EIO);
  const pageIn = prog(f, 112, 16, EIO);

  const label = f < 66 ? 'The default' : f < 112 ? 'Plan first' : 'Then build';
  const labelKey = f < 66 ? 0 : f < 112 ? 1 : 2;
  const labelAt = [14, 66, 112][labelKey];

  return (
    <AbsoluteFill style={{background: C.paper}}>
      <SkillChrome
        n={1}
        name="Frontend Design"
        by="by Anthropic"
        caption={['Plans a point of view from', 'your subject, then builds it.']}
        repo="github.com/anthropics/skills"
      />
      <Abs x={72} y={372}>
        <Rise key={labelKey} at={labelAt} dur={8}>
          <div style={{fontFamily: FONT, fontSize: 30, fontWeight: 600, color: labelKey === 2 ? C.red : C.grey}}>
            {label}
          </div>
        </Rise>
      </Abs>
      <Browser
        x={BX}
        y={BY}
        w={BW}
        h={BH}
        url={f < 112 ? 'untitled.app' : 'night-train.example'}
        style={{opacity: prog(f, 10, 8)}}
      >
        {/* 1. generic */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: genericIn * (1 - genericOut),
            filter: `blur(${genericOut * 10}px)`,
            transform: `scale(${mix(1, 0.96, genericOut)})`,
          }}
        >
          <GenericPage w={IW} h={IH} />
        </div>

        {/* 2. the plan: tokens before code */}
        <div style={{position: 'absolute', inset: 0, padding: '56px 56px', opacity: 1 - planOut}}>
          {PLAN.map(([k, v], i) => {
            const p = prog(f, 72 + i * 5, 10);
            return (
              <div
                key={k}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: 150,
                  borderTop: `2px solid ${p > 0 ? C.ink : 'transparent'}`,
                  opacity: p,
                  transform: `translateY(${(1 - p) * 24}px)`,
                }}
              >
                <div style={{width: 200, fontFamily: FONT, fontSize: 32, fontWeight: 500, color: C.grey}}>{k}</div>
                <div style={{fontFamily: FONT, fontSize: 42, fontWeight: 700, fontStretch: '85%', color: C.ink}}>{v}</div>
              </div>
            );
          })}
        </div>

        {/* 3. the built page */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: C.ink,
            clipPath: `inset(${(1 - pageIn) * 100}% 0 0 0)`,
            color: C.paper,
            fontFamily: FONT,
          }}
        >
          <Abs x={56} y={64}>
            <Rise at={122}>
              <div style={{fontSize: 34, fontWeight: 500, color: '#BDBDBD'}}>Departs nightly from Almaty-2</div>
            </Rise>
          </Abs>
          <Abs x={40} y={120}>
            <Rise at={124} dur={14}>
              <div
                style={{
                  fontSize: 340,
                  fontWeight: 800,
                  fontStretch: `${mix(62, 72, prog(f, 124, 40))}%`,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.92,
                }}
              >
                23:40
              </div>
            </Rise>
          </Abs>
          {/* route line */}
          <Abs x={64} y={520} w={IW - 128} h={4} style={{background: '#333'}}>
            <div style={{width: `${prog(f, 130, 20) * 100}%`, height: '100%', background: C.red}} />
          </Abs>
          <Abs x={56} y={508} w={28} h={28} style={{background: C.red, opacity: prog(f, 130, 4)}} />
          <Abs x={IW - 84} y={508} w={28} h={28} style={{background: C.red, opacity: prog(f, 146, 4)}} />
          <Abs x={56} y={560}>
            <Rise at={134}>
              <div style={{fontSize: 44, fontWeight: 700}}>Almaty-2</div>
            </Rise>
          </Abs>
          <Abs x={IW - 360} y={560} w={304} style={{textAlign: 'right'}}>
            <Rise at={146}>
              <div style={{fontSize: 44, fontWeight: 700}}>Astana</div>
            </Rise>
          </Abs>
          <Abs x={56} y={660} w={IW - 112} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Rise at={140}>
              <div style={{fontSize: 30, color: '#BDBDBD'}}>Train 001, 12 h 48 min</div>
            </Rise>
            <div
              style={{
                padding: '20px 34px',
                background: C.paper,
                color: C.ink,
                fontSize: 30,
                fontWeight: 700,
                opacity: prog(f, 144, 8),
              }}
            >
              Book a berth
            </div>
          </Abs>
        </div>
      </Browser>
    </AbsoluteFill>
  );
};
