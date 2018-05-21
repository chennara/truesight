// @flow

import { Interval } from 'utils/math/interval';

import type { MedianCutParameters } from './median-cut/types';
import type { PopularityParameters } from './popularity/types';

// Parameters object for configuring either the median cut algorithm or the popularity algorithm.
export type ImageQuantizationParameters = MedianCutParameters | PopularityParameters;

// The highest quality for image data extraction.
const HIGHEST_QUALITY = 1;
// The lowest quality for image data extraction, only parses every twenty-fifth pixel.
const LOWEST_QUALITY = 25;

// Defines an interval of valid quality values.
export const VALID_QUALITIES = new Interval(HIGHEST_QUALITY, LOWEST_QUALITY);

// Default number of colors for an image quantization algorithm.
export const DEFAULT_NUMBER_OF_COLORS = 8;
// Default quality for an image quantization algorithm.
export const DEFAULT_QUALITY = HIGHEST_QUALITY;
