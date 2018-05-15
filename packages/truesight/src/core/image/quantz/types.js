// @flow

import type { ImageElement } from 'core/image/types/image-element';
import { RGBImage } from 'core/image/types/rgb-image';

// Used for configuring an image quantization algorithm.
export type ImageQuantizationParameters = RGBImageConfiguration | ImageElementConfiguration;

// Used for configuring an image quantization algorithm from an Image object.
export type RGBImageConfiguration = {|
  rgbImage: RGBImage,
  numberOfColors: number,
  quality: number,
|};

// Used for configuring an image quantization algorithm from an ImageElement object.
export type ImageElementConfiguration = {|
  imageElement: ImageElement,
  numberOfColors: number,
  quality: number,
|};

// The highest quality for image data extraction.
const HIGHEST_QUALITY = 1;
// The lowest quality for image data extraction, only parses every twenty-fifth pixel.
const LOWEST_QUALITY = 25;

// The lower the value, the higher the image quality, the longer the execution time.
class Quality {
  highest: number;
  lowest: number;

  constructor(highest: number, lowest: number) {
    this.highest = highest;
    this.lowest = lowest;
  }

  toString(): string {
    return `[${this.highest}, ${this.lowest}]`;
  }
}

// Defines an interval of valid quality values.
export const VALID_QUALITIES = new Quality(HIGHEST_QUALITY, LOWEST_QUALITY);

// Default number of colors for an image quantization algorithm.
export const DEFAULT_NUMBER_OF_COLORS = 8;
// Default quality for an image quantization algorithm.
export const DEFAULT_QUALITY = HIGHEST_QUALITY;
