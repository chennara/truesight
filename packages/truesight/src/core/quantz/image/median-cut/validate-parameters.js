// @flow

import type { Try } from 'utils/fp/neither';
import { RGBImage } from 'core/image/rgb-image';
import { VALID_QUALITIES, DEFAULT_QUALITY, DEFAULT_NUMBER_OF_COLORS } from 'core/quantz/image/types';

import type {
  MedianCutParameters,
  RGBImageConfiguration,
  ImageElementConfiguration,
  ValidatedMedianCutParameters,
} from './types';

export default function validateParameters(parameters: MedianCutParameters): Try<ValidatedMedianCutParameters> {
  if (!parameters.rgbImage && !parameters.imageElement) {
    return new RangeError('parameters should include either rgbImage or imageElement property');
  }

  if (parameters.rgbImage) {
    return validateRGBImageConfiguration(parameters);
  }

  // parameters is of type ImageElementConfiguration
  return validateImageElementConfiguration(parameters);
}

function validateRGBImageConfiguration(parameters: RGBImageConfiguration): Try<ValidatedMedianCutParameters> {
  const { rgbImage } = parameters;

  if (!(rgbImage instanceof RGBImage)) {
    return new TypeError('image should be of type RGBImage');
  }

  return validateBaseConfiguration(parameters);
}

function validateImageElementConfiguration(parameters: ImageElementConfiguration): Try<ValidatedMedianCutParameters> {
  const { imageElement } = parameters;

  if (!(imageElement instanceof HTMLImageElement) && !(imageElement instanceof HTMLCanvasElement)) {
    return new TypeError('imageElement should be of type HTMLImageElement or HTMLCanvasElement');
  }

  return validateBaseConfiguration(parameters);
}

function validateBaseConfiguration(parameters: MedianCutParameters): Try<ValidatedMedianCutParameters> {
  const { numberOfColors = DEFAULT_NUMBER_OF_COLORS, quality = DEFAULT_QUALITY } = parameters;

  if (!Number.isInteger(numberOfColors)) {
    return new TypeError('numberOfColors should be an integer');
  }
  if (!(numberOfColors >= 1 && numberOfColors <= 256)) {
    return new RangeError('numberOfColors should lie in [1, 256]');
  }

  if (!Number.isInteger(quality)) {
    return new TypeError('quality should be an integer');
  }
  if (!VALID_QUALITIES.liesIn(quality)) {
    return new RangeError(`quality should lie in ${VALID_QUALITIES.toString()}`);
  }

  if (parameters.rgbImage) {
    return { rgbImage: parameters.rgbImage, numberOfColors, quality };
  }

  return { imageElement: parameters.imageElement, numberOfColors, quality };
}
