// @flow

import { Interval } from 'utils/collections/interval';

// Used for configuring a video quantization algorithm.
export type VideoQuantizationParameters = {|
  videoElement: HTMLVideoElement,
  framesPerSecond: number,
  numberOfColors: number,
  quality: number,
|};

// Defines an interval of valid numbers of frames per second.
export const VALID_FRAMES_PER_SECONDS = new Interval(1, 24);

// Default number of frames per second to extract.
export const DEFAULT_FRAMES_PER_SECOND = 1;
