// @flow

import type {
  ImageQuantizationParameters,
  RGBImageConfiguration,
  ImageElementConfiguration,
} from 'core/image/quantz/types';
import type { Try } from 'utils/fp/neither';
import { RGBImage } from 'core/image/types/rgb-image';
import { VALID_QUALITIES, DEFAULT_QUALITY, DEFAULT_NUMBER_OF_COLORS } from 'core/image/quantz/types';

export default function validateParameters(parameters: ImageQuantizationParameters): Try<ImageQuantizationParameters> {
  if (!parameters.rgbImage && !parameters.imageElement) {
    return new RangeError('parameters should include either rgbImage or imageElement property');
  }

  if (parameters.rgbImage) {
    return validateRGBImageConfiguration(parameters);
  }

  // parameters is of type ImageElementConfiguration
  return validateImageElementConfiguration(parameters);
}

function validateRGBImageConfiguration(parameters: RGBImageConfiguration): Try<ImageQuantizationParameters> {
  const { rgbImage } = parameters;

  if (!(rgbImage instanceof RGBImage)) {
    return new TypeError('image should be of type RGBImage');
  }

  return validateBaseConfiguration(parameters);
}

function validateImageElementConfiguration(parameters: ImageElementConfiguration): Try<ImageQuantizationParameters> {
  const { imageElement } = parameters;

  if (!(imageElement instanceof HTMLImageElement) && !(imageElement instanceof HTMLCanvasElement)) {
    return new TypeError('imageElement should be of type HTMLImageElement or HTMLCanvasElement');
  }

  return validateBaseConfiguration(parameters);
}

function validateBaseConfiguration(parameters: ImageQuantizationParameters): Try<ImageQuantizationParameters> {
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
  if (!(quality >= VALID_QUALITIES.highest && quality <= VALID_QUALITIES.lowest)) {
    return new RangeError(`quality should lie in ${VALID_QUALITIES.toString()}`);
  }

  if (parameters.rgbImage) {
    return { rgbImage: parameters.rgbImage, numberOfColors, quality };
  }

  // parameters is of type ImageElementConfiguration
  return { imageElement: parameters.imageElement, numberOfColors, quality };
}
