# 5 Design Skills That Make Claude Code Better at UI Design

A 38-second vertical (1080×1920, 30 fps) motion-design film, built with Remotion + React.
Picture and sound are both generated from code: the soundtrack is synthesised with numpy, nothing sampled.

## The five skills

1. **Frontend Design** (Anthropic) — plans a point of view from the brief's subject before writing code, and steers away from templated defaults.
   https://github.com/anthropics/skills/tree/main/skills/frontend-design
2. **Impeccable** (Paul Bakaus) — one skill, 24 `/impeccable` commands (audit, polish, critique, distill…), plus a detector CLI with 62 deterministic rules for AI-design tells.
   https://github.com/pbakaus/impeccable
3. **UI UX Pro Max** (Next Level Builder) — a design-system generator backed by searchable data: 192 product types, 192 palettes, 79 searchable styles, 74 font pairings, 119 UX guidelines.
   https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
4. **Taste** (Leonxlnx) — deals 3 of 20 researched art directions, builds with credited open-licence imagery, then checks the page in a real browser at three widths and fixes the top problems (up to three rounds).
   https://github.com/Leonxlnx/taste-skill
5. **Emil Kowalski's design-engineering skills** — `emil-design-eng` and 14 companions: ease-out over ease-in, UI motion under 300 ms, `scale(0.97)` on press, never animate from `scale(0)`, popovers grow from their trigger.
   https://github.com/emilkowalski/skills

Facts were checked against each repository in October 2026; counts change as the projects evolve.

## Build

```bash
npm install
python3 audio/make_soundtrack.py          # -> public/soundtrack.wav (needs numpy + scipy)
npx remotion studio src/index.ts          # preview
npx remotion render src/index.ts DesignSkills out/5-design-skills.mp4 --codec=h264 --crf=16
```

`remotion.config.ts` points at a local Chromium headless shell; set `REMOTION_CHROME` to your own, or delete that line to let Remotion download one.

## Structure

- `src/timeline.json` — single source of timing for picture and sound (120 BPM = 15 frames per beat; every cut lands on a beat)
- `src/lib.tsx` — palette, easing curves (the film uses Emil's own ease-out/in-out curves), shared chrome
- `src/Film.tsx` — sequence + the red-square chapter wipe
- `src/scenes/*` — one file per scene
- `audio/make_soundtrack.py` — music bed and every SFX cue
