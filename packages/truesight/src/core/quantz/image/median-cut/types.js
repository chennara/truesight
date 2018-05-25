// @flow

import type { ImageElement } from 'core/image/image-element';
import { RGBImage } from 'core/image/rgb-image';

// Used for configuring the median cut algorithm.
export type MedianCutParameters = RGBImageConfiguration | ImageElementConfiguration;

// Used for configuring the median cut algorithm from a RGBImage object.
export type RGBImageConfiguration = {|
  rgbImage: RGBImage,
  numberOfColors: number,
  quality: number,
|};

// Used for configuring the median cut algorithm from an ImageElement object.
export type ImageElementConfiguration = {|
  imageElement: ImageElement,
  numberOfColors: number,
  quality: number,
|};
