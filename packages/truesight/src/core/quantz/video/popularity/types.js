// @flow

import type { ImageElement } from 'core/image/image-element';
import type { ImageElementConfiguration } from 'core/quantz/image/popularity/types';

import type { VideoParsingParameters } from '../types';

// Used for configuring the popularity algorithm in a video quantization configuration.
export type PopularityVideoParameters = {|
  ...VideoParsingParameters,
  ...PopularityBaseParameters,
|};

// Popularity base parameters to be used in a video parsing implementation.
export type PopularityBaseParameters = $Diff<ImageElementConfiguration, {| imageElement: ImageElement |}>;
