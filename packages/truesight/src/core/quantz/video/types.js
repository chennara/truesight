// @flow

import { Interval } from 'utils/collections/interval';

import type { MedianCutVideoParameters } from './median-cut/types';
import type { PopularityVideoParameters } from './popularity/types';

// Used for configuring a video quantization algorithm.
export type VideoQuantizationParameters = MedianCutVideoParameters | PopularityVideoParameters;

// The parameters for a video parsing implementation.
export type VideoParsingParameters = {|
  videoElement: HTMLVideoElement,
  framesPerSecond?: number,
|};

// VideoParsingParameters object in which the properties have been validated.
export type ValidatedVideoParsingParameters = {|
  videoElement: HTMLVideoElement,
  framesPerSecond: number,
|};

// An interval of valid numbers of frames per second.
export const VALID_FRAMES_PER_SECONDS = new Interval(1, 24);

// Default number of frames per second to extract.
export const DEFAULT_FRAMES_PER_SECOND = 1;
