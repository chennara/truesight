// @flow

import type { ImageElement } from 'core/image/image-element';
import { RGBImage } from 'core/image/rgb-image';

// Used for configuring the median cut algorithm.
export type MedianCutParameters = ImageElementConfiguration | RGBImageConfiguration;

// Used for configuring the median cut algorithm from an ImageElement object.
export type ImageElementConfiguration = {|
  imageElement: ImageElement,
  numberOfColors?: number,
  quality?: number,
|};

// Used for configuring the median cut algorithm from a RGBImage object.
export type RGBImageConfiguration = {|
  rgbImage: RGBImage,
  numberOfColors?: number,
  quality?: number,
|};

// MedianCutParameters object in which the properties have been validated.
export type ValidatedMedianCutParameters = ValidatedImageElementConfiguration | ValidatedRGBImageConfiguration;

// ImageElementConfiguration object in which the properties have been validated.
export type ValidatedImageElementConfiguration = {|
  imageElement: ImageElement,
  numberOfColors: number,
  quality: number,
|};

// RGBImageConfiguration object in which the properties have been validated.
export type ValidatedRGBImageConfiguration = {|
  rgbImage: RGBImage,
  numberOfColors: number,
  quality: number,
|};
