import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import '@fontsource-variable/archivo/standard.css';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/montserrat/500.css';
import '@fontsource/montserrat/600.css';
import T from './timeline.json';
import {Abs, C, EIO, FONT, mix, prog, Progress} from './lib';
import {Hook} from './scenes/Hook';
import {Title} from './scenes/Title';
import {S1} from './scenes/S1FrontendDesign';
import {S2} from './scenes/S2Impeccable';
import {S3} from './scenes/S3UIUXProMax';
import {S4} from './scenes/S4Taste';
import {S5} from './scenes/S5Emil';
import {Outro} from './scenes/Outro';

const S = T.scenes as unknown as Record<string, [number, number]>;

// The red selection square is the film's only transition device:
// it grows to fill the frame, names the chapter, and collapses into
// the chapter's index square (72, 214, 36x36).
const Wipe: React.FC<{at: number; label: string}> = ({at, label}) => {
  const f = useCurrentFrame();
  if (f < at - 12 || f > at + 22) return null;
  const grow = prog(f, at - 12, 12, EIO);
  const shrink = prog(f, at + 8, 13, EIO);
  const full = {x: -20, y: -20, w: 1120, h: 1960};
  const small = {x: 72, y: 214, w: 36, h: 36};
  const end = label ? small : {x: 0, y: -1960, w: 1080, h: 1920};
  const t = grow < 1 ? grow : shrink;
  const a = grow < 1 ? small : full;
  const b = grow < 1 ? full : end;
  const r = {
    x: mix(a.x, b.x, t),
    y: mix(a.y, b.y, t),
    w: mix(a.w, b.w, t),
    h: mix(a.h, b.h, t),
  };
  const numP = prog(f, at - 7, 8);
  const numOut = prog(f, at + 8, 6, EIO);
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <Abs x={r.x} y={r.y} w={r.w} h={r.h} style={{background: C.red}} />
      {label && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', overflow: 'hidden'}}>
          <div
            style={{
              fontFamily: FONT,
              fontSize: 720,
              fontWeight: 900,
              fontStretch: `${mix(62, 90, numP)}%`,
              color: C.paper,
              letterSpacing: '-0.04em',
              lineHeight: 1,
              opacity: numP * (1 - numOut),
              transform: `translateY(${(1 - numP) * 80 - numOut * 80}px)`,
            }}
          >
            {label}
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export const Film: React.FC = () => {
  const f = useCurrentFrame();
  const seq = (k: string, el: React.ReactNode) => (
    <Sequence from={S[k][0]} durationInFrames={S[k][1] - S[k][0]} layout="none">
      <AbsoluteFill>{el}</AbsoluteFill>
    </Sequence>
  );
  const inChapters = f >= 180 && f < 1020;
  return (
    <AbsoluteFill style={{background: C.paper}}>
      {seq('hook', <Hook />)}
      {seq('title', <Title />)}
      {seq('s1', <S1 />)}
      {seq('s2', <S2 />)}
      {seq('s3', <S3 />)}
      {seq('s4', <S4 />)}
      {seq('s5', <S5 />)}
      {seq('outro', <Outro />)}
      {inChapters && <Progress global={f} />}
      {T.wipes.map((w) => (
        <Wipe key={w.at} at={w.at} label={w.label} />
      ))}
      <Audio src={staticFile('soundtrack.wav')} />
    </AbsoluteFill>
  );
};
