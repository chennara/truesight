// @flow

import { Interval } from 'utils/collections/interval';

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
