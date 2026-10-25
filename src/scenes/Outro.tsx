import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, C, EIO, FONT, MONO, mix, prog, Rise} from '../lib';

const LIST: [string, string][] = [
  ['Frontend Design', 'Anthropic'],
  ['Impeccable', 'Paul Bakaus'],
  ['UI UX Pro Max', 'Next Level Builder'],
  ['Taste', 'Leonxlnx'],
  ['Design Engineering', 'Emil Kowalski'],
];

export const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const listOut = prog(f, 58, 12, EIO);
  const w = mix(62, 100, prog(f, 70, 45));
  const line: React.CSSProperties = {
    fontFamily: FONT,
    fontSize: 178,
    fontWeight: 800,
    fontStretch: `${w}%`,
    letterSpacing: '-0.035em',
    lineHeight: 0.94,
    color: C.paper,
    whiteSpace: 'nowrap',
  };
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Abs x={72} y={440} w={936} style={{opacity: 1 - listOut, transform: `translateY(${-listOut * 40}px)`}}>
        {LIST.map(([name, by], i) => {
          const p = prog(f, 20 + i * 4, 10);
          return (
            <div
              key={name}
              style={{
                display: 'flex',
                alignItems: 'center',
                height: 150,
                borderTop: `2px solid ${p > 0 ? '#2a2a2a' : 'transparent'}`,
                opacity: p,
                transform: `translateY(${(1 - p) * 20}px)`,
              }}
            >
              <div style={{width: 28, height: 28, background: C.red, marginRight: 30}} />
              <div style={{flex: 1, fontFamily: FONT, fontSize: 64, fontWeight: 800, fontStretch: '82%', color: C.paper, letterSpacing: '-0.02em'}}>
                {name}
              </div>
              <div style={{fontFamily: FONT, fontSize: 28, color: C.grey}}>{by}</div>
            </div>
          );
        })}
      </Abs>
      <Abs x={72} y={600} w={936}>
        <Rise at={70}>
          <div style={line}>Taste is</div>
        </Rise>
        <Rise at={74}>
          <div style={line}>now</div>
        </Rise>
        <Rise at={78}>
          <div style={line}>
            installable<span style={{color: C.red}}>.</span>
          </div>
        </Rise>
      </Abs>
      <Abs x={72} y={1250} w={936}>
        <Rise at={92}>
          <div style={{fontFamily: FONT, fontSize: 52, fontWeight: 600, color: C.grey}}>Pick one. Try it on your next UI.</div>
        </Rise>
      </Abs>
      <Abs x={72} y={1420} style={{fontFamily: MONO, fontSize: 26, color: '#6a6a6a', opacity: prog(f, 98, 10)}}>
        5 design skills for Claude Code
      </Abs>
    </AbsoluteFill>
  );
};
