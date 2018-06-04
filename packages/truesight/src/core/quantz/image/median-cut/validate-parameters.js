// @flow

import { RGBImage } from 'core/image/rgb-image';
import loadImage from 'core/image/load-image';
import hasUnknownProperties from 'utils/collections/object/has-unknown-properties';

import { VALID_QUALITIES, DEFAULT_QUALITY, DEFAULT_NUMBER_OF_COLORS } from '../types';

import type {
  MedianCutParameters,
  ImageElementConfiguration,
  RGBImageConfiguration,
  ValidatedMedianCutParameters,
} from './types';

export default async function validateMedianCutParameters(
  parameters: MedianCutParameters
): Promise<ValidatedMedianCutParameters> {
  if (!parameters.imageElement && !parameters.rgbImage) {
    throw new RangeError('parameters argument should include either imageElement or rgbImage property');
  }

  if (parameters.imageElement) {
    return validateImageElementConfiguration(parameters);
  }

  // parameters is of type RGBImageConfiguration
  return validateRGBImageConfiguration(parameters);
}

async function validateImageElementConfiguration(
  parameters: ImageElementConfiguration
): Promise<ValidatedMedianCutParameters> {
  const unknownProperties = hasUnknownProperties(parameters, ['imageElement', 'numberOfColors', 'quality']);

  if (unknownProperties instanceof Error) {
    throw unknownProperties;
  }

  const { imageElement } = parameters;

  if (!(imageElement instanceof HTMLImageElement) && !(imageElement instanceof HTMLCanvasElement)) {
    throw new TypeError('imageElement property should be of type HTMLImageElement or HTMLCanvasElement');
  }

  if (imageElement instanceof HTMLImageElement) {
    await loadImage(imageElement);
  }

  return validateBaseConfiguration(parameters);
}

function validateRGBImageConfiguration(parameters: RGBImageConfiguration): Promise<ValidatedMedianCutParameters> {
  const unknownProperties = hasUnknownProperties(parameters, ['rgbImage', 'numberOfColors', 'quality']);

  if (unknownProperties instanceof Error) {
    throw unknownProperties;
  }

  const { rgbImage } = parameters;

  if (!(rgbImage instanceof RGBImage)) {
    throw new TypeError('image property should be of type RGBImage');
  }

  return validateBaseConfiguration(parameters);
}

async function validateBaseConfiguration(parameters: MedianCutParameters): Promise<ValidatedMedianCutParameters> {
  const { numberOfColors = DEFAULT_NUMBER_OF_COLORS, quality = DEFAULT_QUALITY } = parameters;

  if (!Number.isInteger(numberOfColors)) {
    throw new TypeError('numberOfColors property should be an integer');
  }
  if (!(numberOfColors >= 1 && numberOfColors <= 256)) {
    throw new RangeError('numberOfColors property should lie in [1, 256]');
  }

  if (!Number.isInteger(quality)) {
    throw new TypeError('quality property should be an integer');
  }
  if (!VALID_QUALITIES.liesIn(quality)) {
    throw new RangeError(`quality property should lie in ${VALID_QUALITIES.toString()}`);
  }

  if (parameters.imageElement) {
    return { imageElement: parameters.imageElement, numberOfColors, quality };
  }

  // parameters includes rgbImage property
  return { rgbImage: parameters.rgbImage, numberOfColors, quality };
}
