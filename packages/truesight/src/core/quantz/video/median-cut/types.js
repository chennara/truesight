// @flow

import type { ImageElement } from 'core/image/image-element';
import type { ImageElementConfiguration } from 'core/quantz/image/median-cut/types';

import type { VideoParsingParameters } from '../types';

// Used for configuring the median cut algorithm in a video quantization configuration.
export type MedianCutVideoParameters = {|
  ...VideoParsingParameters,
  ...MedianCutBaseParameters,
|};

// Median cut base parameters to be used in a video parsing implementation.
export type MedianCutBaseParameters = $Diff<ImageElementConfiguration, {| imageElement: ImageElement |}>;
