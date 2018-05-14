// @flow

import type { ImageElement } from 'core/image/image-element';
import { RGBImage } from 'core/image/rgb-image';

// Used for configuring a color quantization algorithm.
export type QuantizationParameters = RGBImageConfiguration | ImageElementConfiguration;

// Used for configuring a color quantization algorithm from an Image object.
export type RGBImageConfiguration = {|
  rgbImage: RGBImage,
  numberOfColors?: number,
  quality?: number,
|};

// Used for configuring a color quantization algorithm from an ImageElement object.
export type ImageElementConfiguration = {|
  imageElement: ImageElement,
  numberOfColors?: number,
  quality?: number,
|};

// QuantizationParameters object in which the properties have already been validated.
export type ValidatedQuantizationParameters = ValidatedRGBImageConfiguration | ValidatedImageElementConfiguration;

// RGBImageConfiguration object in which the properties have already been validated.
export type ValidatedRGBImageConfiguration = {|
  rgbImage: RGBImage,
  numberOfColors: number,
  quality: number,
|};

// ImageElementConfiguration in which the properties have already been validated.
export type ValidatedImageElementConfiguration = {|
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

// Default number of colors for a color quantization algorithm.
export const DEFAULT_NUMBER_OF_COLORS = 8;
// Default quality for a color quantization algorithm.
export const DEFAULT_QUALITY = HIGHEST_QUALITY;
