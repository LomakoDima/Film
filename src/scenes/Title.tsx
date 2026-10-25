import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, C, FONT, mix, prog, Rise} from '../lib';

export const Title: React.FC = () => {
  const f = useCurrentFrame();
  // The "5" breathes along its width axis: condensed -> wide.
  const w = mix(62, 112, prog(f, 4, 60));
  const big: React.CSSProperties = {
    fontFamily: FONT,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 0.9,
    color: C.ink,
  };
  return (
    <AbsoluteFill style={{background: C.paper}}>
      <Abs x={52} y={70}>
        <Rise at={0} dur={10} style={{paddingTop: 90}}>
          <div style={{...big, fontSize: 820, fontWeight: 900, fontStretch: `${w}%`, color: C.red, lineHeight: 0.86}}>
            5
          </div>
        </Rise>
      </Abs>
      <Abs x={72} y={930} w={936}>
        <Rise at={5}>
          <div style={{...big, fontSize: 196, fontStretch: '70%'}}>design</div>
        </Rise>
        <Rise at={9}>
          <div style={{...big, fontSize: 196, fontStretch: '70%'}}>skills</div>
        </Rise>
        <div style={{height: 40}} />
        <Rise at={18}>
          <div style={{fontFamily: FONT, fontSize: 60, fontWeight: 600, fontStretch: '90%', lineHeight: 1.1, color: C.ink}}>
            that make Claude Code
          </div>
        </Rise>
        <Rise at={21}>
          <div style={{fontFamily: FONT, fontSize: 60, fontWeight: 600, fontStretch: '90%', lineHeight: 1.1, color: C.ink}}>
            better at UI design.
          </div>
        </Rise>
      </Abs>
    </AbsoluteFill>
  );
};
