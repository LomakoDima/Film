import React from 'react';
import {Composition} from 'remotion';
import T from './timeline.json';
import {Film} from './Film';

export const Root: React.FC = () => (
  <Composition
    id="DesignSkills"
    component={Film}
    durationInFrames={T.total}
    fps={T.fps}
    width={T.width}
    height={T.height}
  />
);
