import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Abs, C, EIO, FONT, INTER, MONO, mix, prog, SkillChrome, typed} from '../lib';

const CX = 152;
const CY = 520;
const CW = 776;
const CH = 700;

// [label, y of target, side]
const FLAGS: [string, number, 'l' | 'r'][] = [
  ['Overused font', 600, 'r'],
  ['Purple gradient', 690, 'l'],
  ['Gray text on colour', 770, 'r'],
  ['Cards nested in cards', 872, 'l'],
  ['Bounce easing', 1110, 'r'],
];

const COMMANDS = ['polish', 'distill', 'bolder', 'quieter', 'typeset', 'critique', 'animate', 'harden', 'layout'];

const BeforeCard: React.FC<{f: number}> = ({f}) => {
  // bounce easing: overshooting loop on the button
  const t = ((f - 30) % 30) / 30;
  const b = t < 0 ? 0 : Math.sin(t * Math.PI * 3) * Math.exp(-t * 4);
  return (
    <div style={{position: 'absolute', inset: 0, borderRadius: 32, overflow: 'hidden', fontFamily: INTER, background: '#fff'}}>
      <div
        style={{
          height: 300,
          background: 'linear-gradient(135deg,#7C3AED,#4F46E5 55%,#3B82F6)',
          padding: '50px 56px',
        }}
      >
        <div style={{fontSize: 56, fontWeight: 700, color: '#fff', letterSpacing: '-0.02em'}}>Pro plan</div>
        <div style={{fontSize: 30, color: '#A1A1AA', marginTop: 18}}>Everything you need to scale.</div>
      </div>
      <div style={{padding: 40}}>
        <div style={{borderRadius: 24, padding: 30, boxShadow: '0 8px 24px rgba(0,0,0,.12)', background: '#fff'}}>
          <div style={{borderRadius: 18, padding: 26, boxShadow: '0 6px 18px rgba(0,0,0,.10)', background: '#F8FAFC'}}>
            <div style={{fontSize: 48, fontWeight: 700, color: '#111'}}>
              $29<span style={{fontSize: 26, color: '#94A3B8'}}> /month</span>
            </div>
          </div>
        </div>
        <div
          style={{
            marginTop: 40,
            height: 92,
            borderRadius: 999,
            background: 'linear-gradient(90deg,#8B5CF6,#3B82F6)',
            color: '#fff',
            fontSize: 30,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${1 + b * 0.12})`,
          }}
        >
          Upgrade now 🚀
        </div>
      </div>
    </div>
  );
};

const AfterCard: React.FC = () => (
  <div style={{position: 'absolute', inset: 0, background: '#fff', fontFamily: FONT, color: C.ink, padding: '54px 56px'}}>
    <div style={{fontSize: 34, fontWeight: 600, color: C.greyDark}}>Pro</div>
    <div style={{fontSize: 210, fontWeight: 800, fontStretch: '70%', letterSpacing: '-0.04em', lineHeight: 1, marginTop: 10}}>
      $29
    </div>
    <div style={{fontSize: 32, color: C.greyDark, marginTop: 6}}>per month, billed yearly</div>
    <div style={{height: 2, background: C.ink, margin: '44px 0 34px'}} />
    <div style={{fontSize: 32, lineHeight: 1.5}}>Unlimited projects. Priority support.</div>
    <div
      style={{
        position: 'absolute',
        left: 56,
        right: 56,
        bottom: 56,
        height: 96,
        background: C.red,
        color: '#fff',
        fontSize: 34,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        padding: '0 34px',
      }}
    >
      Upgrade to Pro
    </div>
  </div>
);

export const S2: React.FC = () => {
  const f = useCurrentFrame();
  const fix = prog(f, 116, 14, EIO);
  const cmd1 = '/impeccable audit';
  const cycling = f >= 140;
  const cmdIdx = Math.min(COMMANDS.length - 1, Math.floor(Math.max(0, f - 140) / 4));
  const line =
    f < 100 ? typed(cmd1, f, 18, 1.6) : !cycling ? '/impeccable ' + typed('polish', f, 104, 1.2) : '/impeccable ' + COMMANDS[cmdIdx];
  const caret = Math.floor(f / 8) % 2 === 0;

  return (
    <AbsoluteFill style={{background: C.ink}}>
      <SkillChrome
        n={2}
        name="Impeccable"
        by="by Paul Bakaus"
        caption={['Flags the tells of AI design.', '24 commands to fix them.']}
        repo="github.com/pbakaus/impeccable"
        dark
      />
      {/* terminal line */}
      <Abs x={72} y={384} w={936} style={{fontFamily: MONO, fontSize: 40, color: C.paper, display: 'flex', alignItems: 'center'}}>
        <span style={{color: C.red, marginRight: 18}}>›</span>
        <span>{line}</span>
        <span style={{width: 20, height: 44, marginLeft: 4, background: caret ? C.paper : 'transparent'}} />
        {cycling && (
          <span style={{marginLeft: 'auto', fontFamily: FONT, fontSize: 32, fontWeight: 600, color: C.grey}}>24 commands</span>
        )}
      </Abs>
      <Abs x={72} y={448} style={{fontFamily: MONO, fontSize: 26, color: C.red, opacity: prog(f, 84, 6) * (1 - prog(f, 116, 6))}}>
        5 issues found
      </Abs>
      <Abs x={72} y={448} style={{fontFamily: MONO, fontSize: 26, color: C.grey, opacity: prog(f, 130, 6)}}>
        0 issues, ready to ship
      </Abs>

      <Abs x={CX} y={CY} w={CW} h={CH} style={{opacity: prog(f, 12, 10)}}>
        <div style={{position: 'absolute', inset: 0, opacity: 1 - fix, filter: `blur(${fix * 4}px)`}}>
          <BeforeCard f={f} />
        </div>
        <div style={{position: 'absolute', inset: 0, opacity: fix, filter: `blur(${(1 - fix) * 4}px)`}}>
          <AfterCard />
        </div>
      </Abs>

      {FLAGS.map(([label, y, side], i) => {
        const at = 38 + i * 9;
        const p = prog(f, at, 7);
        const out = prog(f, 112 + i * 2, 8, EIO);
        const lineW = prog(f, at - 2, 8) * 60;
        const x = side === 'l' ? 40 : undefined;
        return (
          <div
            key={label}
            style={{
              position: 'absolute',
              top: y - 28,
              left: x,
              right: side === 'r' ? 40 : undefined,
              display: 'flex',
              flexDirection: side === 'l' ? 'row' : 'row-reverse',
              alignItems: 'center',
              opacity: p * (1 - out),
              transform: `scale(${mix(0.92, 1, p) * mix(1, 0.95, out)})`,
              transformOrigin: side === 'l' ? 'left center' : 'right center',
            }}
          >
            <div
              style={{
                background: C.red,
                color: '#fff',
                fontFamily: FONT,
                fontSize: 30,
                fontWeight: 700,
                padding: '10px 20px',
                whiteSpace: 'nowrap',
                borderRadius: 6,
              }}
            >
              {label}
            </div>
            <div style={{width: lineW, height: 3, background: C.red}} />
            <div style={{width: 14, height: 14, borderRadius: 7, background: C.red, opacity: p}} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
