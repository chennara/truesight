// @flow

import { asyncTry } from 'utils/fp/try';

import type { ValidatedMedianCutParameters } from '../median-cut/types';
import validateMedianCutParameters from '../median-cut/validate-parameters';

import type {
  PopularityParameters,
  ImageElementConfiguration,
  RGBImageConfiguration,
  ValidatedPopularityParameters,
} from './types';
import { DEFAULT_REGION_SIZE } from './types';

export default async function validatePopularityParameters(
  parameters: PopularityParameters
): Promise<ValidatedPopularityParameters> {
  const unknownProperties = getUnknownProperties(parameters);

  if (unknownProperties.length !== 0) {
    return Promise.reject(new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`));
  }

  const { regionSize = DEFAULT_REGION_SIZE } = parameters;

  if (regionSize.length !== 3) {
    return Promise.reject(new TypeError('regionSize property should be of type [number, number, number]'));
  }

  const [hue, saturation, lightness] = regionSize;

  if (!Number.isInteger(hue)) {
    return Promise.reject(new TypeError('hue in regionSize property should be an integer'));
  }
  if (!(hue >= 1 && hue <= 360)) {
    return Promise.reject(new RangeError('hue in regionSize property should lie in [1, 360]'));
  }

  if (!Number.isInteger(saturation)) {
    return Promise.reject(new TypeError('saturation in regionSize property should be an integer'));
  }
  if (!(saturation >= 1 && saturation <= 100)) {
    return Promise.reject(new RangeError('saturation in regionSize property should lie in [1, 100]'));
  }

  if (!Number.isInteger(lightness)) {
    return Promise.reject(new TypeError('lightness in regionSize property should be an integer'));
  }
  if (!(lightness >= 1 && lightness <= 100)) {
    return Promise.reject(new RangeError('lightness in regionSize property should lie in [1, 100]'));
  }

  return asyncTry(async () => {
    const validatedBaseParameters = await validateBaseParameters(parameters);

    return Promise.resolve({
      ...validatedBaseParameters,
      regionSize,
    });
  });
}

function getUnknownProperties(parameters: PopularityParameters): string[] {
  if (parameters.imageElement) {
    return getUnknownImageElementProperties(parameters);
  }

  // parameters is of type RGBImageConfiguration
  return getUnknownRGBImageProperties(parameters);
}

function getUnknownImageElementProperties(parameters: ImageElementConfiguration): string[] {
  const properties = Object.keys(parameters);
  const validProperties = ['imageElement', 'numberOfColors', 'quality', 'regionSize'];

  return properties.filter((property) => !validProperties.includes(property));
}

function getUnknownRGBImageProperties(parameters: RGBImageConfiguration): string[] {
  const properties = Object.keys(parameters);
  const validProperties = ['rgbImage', 'numberOfColors', 'quality', 'regionSize'];

  return properties.filter((property) => !validProperties.includes(property));
}

function validateBaseParameters(parameters: PopularityParameters): Promise<ValidatedMedianCutParameters> {
  if (parameters.imageElement) {
    const { imageElement, numberOfColors, quality } = parameters;
    return validateMedianCutParameters({ imageElement, numberOfColors, quality });
  }

  // parameters is of type RGBImageConfiguration
  const { rgbImage, numberOfColors, quality } = parameters;
  return validateMedianCutParameters({ rgbImage, numberOfColors, quality });
}
