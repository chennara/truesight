// @flow

export type PopularityVideoParameters = {|
  videoElement: HTMLVideoElement,
  secondsBetweenFrames: number,
  numberOfColors: number,
  quality: number,
|};

export type ParsingResult<T> = {|
  index: number,
  timestamp: number,
  result: T,
|};

export type ParsingResultCollection<T> = ParsingResult<T>[];
