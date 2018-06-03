// @flow

import { RGBImage } from 'core/image/rgb-image';
import { asyncTry } from 'utils/fp/try';
import loadImage from 'core/image/load-image';

import { VALID_QUALITIES, DEFAULT_QUALITY, DEFAULT_NUMBER_OF_COLORS } from '../types';

import type {
  MedianCutParameters,
  ImageElementConfiguration,
  RGBImageConfiguration,
  ValidatedMedianCutParameters,
} from './types';

export default function validateMedianCutParameters(
  parameters: MedianCutParameters
): Promise<ValidatedMedianCutParameters> {
  if (!parameters.imageElement && !parameters.rgbImage) {
    return Promise.reject(
      new RangeError('parameters argument should include either imageElement or rgbImage property')
    );
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
  const unknownProperties = getUnknownImageElementProperties(parameters);

  if (unknownProperties.length !== 0) {
    return Promise.reject(new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`));
  }

  const { imageElement } = parameters;

  if (!(imageElement instanceof HTMLImageElement) && !(imageElement instanceof HTMLCanvasElement)) {
    return Promise.reject(
      new TypeError('imageElement property should be of type HTMLImageElement or HTMLCanvasElement')
    );
  }

  if (imageElement instanceof HTMLImageElement) {
    return asyncTry(async () => {
      await loadImage(imageElement);

      return validateBaseConfiguration(parameters);
    });
  }

  return validateBaseConfiguration(parameters);
}

function getUnknownImageElementProperties(parameters: MedianCutParameters): string[] {
  const properties = Object.keys(parameters);
  const validProperties = ['imageElement', 'numberOfColors', 'quality'];

  return properties.filter((property) => !validProperties.includes(property));
}

function validateRGBImageConfiguration(parameters: RGBImageConfiguration): Promise<ValidatedMedianCutParameters> {
  const unknownProperties = getUnknownRGBImageProperties(parameters);

  if (unknownProperties.length !== 0) {
    return Promise.reject(new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`));
  }

  const { rgbImage } = parameters;

  if (!(rgbImage instanceof RGBImage)) {
    return Promise.reject(new TypeError('image property should be of type RGBImage'));
  }

  return validateBaseConfiguration(parameters);
}

function getUnknownRGBImageProperties(parameters: MedianCutParameters): string[] {
  const properties = Object.keys(parameters);
  const validProperties = ['rgbImage', 'numberOfColors', 'quality'];

  return properties.filter((property) => !validProperties.includes(property));
}

function validateBaseConfiguration(parameters: MedianCutParameters): Promise<ValidatedMedianCutParameters> {
  const { numberOfColors = DEFAULT_NUMBER_OF_COLORS, quality = DEFAULT_QUALITY } = parameters;

  if (!Number.isInteger(numberOfColors)) {
    return Promise.reject(new TypeError('numberOfColors property should be an integer'));
  }
  if (!(numberOfColors >= 1 && numberOfColors <= 256)) {
    return Promise.reject(new RangeError('numberOfColors property should lie in [1, 256]'));
  }

  if (!Number.isInteger(quality)) {
    return Promise.reject(new TypeError('quality property should be an integer'));
  }
  if (!VALID_QUALITIES.liesIn(quality)) {
    return Promise.reject(new RangeError(`quality property should lie in ${VALID_QUALITIES.toString()}`));
  }

  if (parameters.imageElement) {
    return Promise.resolve({ imageElement: parameters.imageElement, numberOfColors, quality });
  }

  // parameters includes rgbImage property
  return Promise.resolve({ rgbImage: parameters.rgbImage, numberOfColors, quality });
}
