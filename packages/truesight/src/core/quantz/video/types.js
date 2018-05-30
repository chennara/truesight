// @flow

// Used for configuring a video parsing implementation.
export type VideoParsingParameters = {|
  videoElement: HTMLVideoElement,
  secondsBetweenFrames?: number,
|};

// VideoParsingParameters object in which the properties have been validated.
export type ValidatedVideoParsingParameters = {|
  videoElement: HTMLVideoElement,
  secondsBetweenFrames: number,
|};

// Default number of seconds between frames.
export const DEFAULT_SECONDS_BETWEEN_FRAMES = 1;
