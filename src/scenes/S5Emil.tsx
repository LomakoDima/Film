import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame} from 'remotion';
import {Abs, C, EO, FONT, MONO, mix, prog, Rise, SkillChrome} from '../lib';

const easeIn = Easing.bezier(0.42, 0, 1, 1);
const FPS = 30;

const Rule: React.FC<{at: number; y: number; title: string; note: string}> = ({at, y, title, note}) => (
  <Abs x={72} y={y} w={936}>
    <Rise at={at}>
      <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between'}}>
        <div style={{fontFamily: FONT, fontSize: 48, fontWeight: 800, fontStretch: '82%', letterSpacing: '-0.015em', color: C.ink}}>
          {title}
        </div>
        <div style={{fontFamily: MONO, fontSize: 26, color: C.red}}>{note}</div>
      </div>
    </Rise>
  </Abs>
);

// A dot that travels a lane on loop, with a short trail.
const Lane: React.FC<{y: number; at: number; ms: number; ease: (t: number) => number; good: boolean; label: string}> = ({y, at, ms, ease, good, label}) => {
  const f = useCurrentFrame();
  const dur = (ms / 1000) * FPS;
  const period = 30;
  const pos = (fr: number) => {
    if (fr < at) return 0;
    const local = (fr - at) % period;
    return ease(Math.min(1, local / dur));
  };
  const x0 = 72;
  const x1 = 1008 - 40;
  const show = prog(f, at - 8, 8);
  const col = good ? C.red : '#BDBDBD';
  return (
    <>
      <Abs x={x0} y={y} style={{fontFamily: MONO, fontSize: 27, color: good ? C.ink : C.grey, opacity: show}}>
        {label}
      </Abs>
      <Abs x={x0} y={y + 58} w={936} h={2} style={{background: C.rule, opacity: show}} />
      {[3, 2, 1, 0].map((k) => (
        <Abs
          key={k}
          x={mix(x0, x1, pos(f - k))}
          y={y + 40}
          w={40}
          h={40}
          style={{background: col, borderRadius: 20, opacity: show * (k === 0 ? 1 : 0.18 * (4 - k))}}
        />
      ))}
    </>
  );
};

export const S5: React.FC = () => {
  const f = useCurrentFrame();

  // press: scale(0.97) on :active, 160ms ease-out each way
  const pressAt = [84, 104];
  let s = 1;
  for (const p of pressAt) {
    const down = prog(f, p, 5, EO);
    const up = prog(f, p + 6, 5, EO);
    s *= mix(1, 0.97, down - up);
  }
  const cursorIn = prog(f, 66, 14);
  const pressing = pressAt.some((p) => f >= p && f < p + 6);

  // popover from its trigger: scale(.95)+opacity vs scale(0) from centre
  const popLoop = (base: number) => {
    const local = Math.max(0, f - base) % 24;
    return f < base ? 0 : local < 12 ? prog(local, 0, 6, EO) : 1 - prog(local, 14, 6, EO);
  };
  const good = popLoop(124);
  const bad = popLoop(124);

  return (
    <AbsoluteFill style={{background: C.paper}}>
      <SkillChrome
        n={5}
        name="Design Engineering"
        by="by Emil Kowalski"
        caption={['Motion rules that make', 'an interface feel right.']}
        repo="github.com/emilkowalski/skills"
      />

      {/* 1. easing + duration */}
      <Rule at={14} y={386} title="Ease out. Stay under 300 ms." note="ease-in feels slow" />
      <Lane y={466} at={22} ms={400} ease={easeIn} good={false} label="ease-in, 400 ms" />
      <Lane y={566} at={22} ms={180} ease={EO} good label="ease-out, 180 ms" />

      {/* 2. press feedback */}
      <Rule at={60} y={706} title="Every press answers back." note="scale(0.97)" />
      <Abs x={72} y={790} w={936} h={170} style={{opacity: prog(f, 64, 8)}}>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 20,
            width: 560,
            height: 130,
            background: C.ink,
            color: C.paper,
            fontFamily: FONT,
            fontSize: 42,
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 18,
            transform: `scale(${s})`,
          }}
        >
          Save changes
        </div>
        {/* cursor */}
        <svg
          width="56"
          height="70"
          viewBox="0 0 28 35"
          style={{
            position: 'absolute',
            left: mix(760, 330, cursorIn),
            top: mix(170, 74, cursorIn),
            opacity: cursorIn,
            transform: `scale(${pressing ? 0.9 : 1})`,
          }}
        >
          <path d="M2 2 L2 28 L9 21 L14 33 L19 31 L14 19 L24 19 Z" fill={C.ink} stroke={C.paper} strokeWidth="2" />
        </svg>
        <div style={{position: 'absolute', left: 620, top: 56, fontFamily: MONO, fontSize: 28, color: C.greyDark, lineHeight: 1.5}}>
          160 ms
          <br />
          ease-out
        </div>
      </Abs>

      {/* 3. origin-aware entrances */}
      <Rule at={108} y={1010} title="Nothing appears from nothing." note="scale(0.95), not 0" />
      <Abs x={72} y={1086} w={936} h={250} style={{opacity: prog(f, 112, 8)}}>
        {/* wrong */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 440}}>
          <div style={{fontFamily: MONO, fontSize: 25, color: C.grey}}>scale(0), from centre</div>
          <div style={{marginTop: 18, width: 150, height: 56, border: '2px solid #BDBDBD', borderRadius: 12, fontFamily: FONT, fontSize: 26, color: C.grey, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            Share
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 112,
              width: 300,
              height: 120,
              borderRadius: 14,
              background: '#E9E9E9',
              transform: `scale(${bad})`,
              transformOrigin: 'center',
            }}
          />
        </div>
        {/* right */}
        <div style={{position: 'absolute', left: 496, top: 0, width: 440}}>
          <div style={{fontFamily: MONO, fontSize: 25, color: C.ink}}>scale(0.95), from trigger</div>
          <div style={{marginTop: 18, width: 150, height: 56, background: C.ink, borderRadius: 12, fontFamily: FONT, fontSize: 26, fontWeight: 700, color: C.paper, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            Share
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 112,
              width: 300,
              height: 120,
              borderRadius: 14,
              background: C.paper,
              border: `2px solid ${C.ink}`,
              boxShadow: '0 12px 30px rgba(0,0,0,0.14)',
              transform: `scale(${mix(0.95, 1, good)})`,
              opacity: good,
              transformOrigin: 'top left',
              padding: '18px 22px',
            }}
          >
            {[70, 50].map((w, k) => (
              <div key={k} style={{height: 14, width: `${w}%`, background: k ? '#D6D6D6' : C.ink, marginBottom: 18, borderRadius: 4}} />
            ))}
          </div>
        </div>
      </Abs>
    </AbsoluteFill>
  );
};
