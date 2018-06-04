// @flow

import type { Try } from 'utils/fp/neither';
import hasUnknownProperties from 'utils/collections/object/has-unknown-properties';

import type { ValidatedMedianCutParameters } from '../median-cut/types';
import validateMedianCutParameters from '../median-cut/validate-parameters';

import type { PopularityParameters, ValidatedPopularityParameters } from './types';
import { DEFAULT_REGION_SIZE } from './types';

export default async function validatePopularityParameters(
  parameters: PopularityParameters
): Promise<ValidatedPopularityParameters> {
  const unknownProperties = hasUnknownPopularityProperties(parameters);

  if (unknownProperties instanceof Error) {
    throw unknownProperties;
  }

  const { regionSize = DEFAULT_REGION_SIZE } = parameters;

  if (regionSize.length !== 3) {
    throw new TypeError('regionSize property should be of type [number, number, number]');
  }

  const [hue, saturation, lightness] = regionSize;

  if (!Number.isInteger(hue)) {
    throw new TypeError('hue in regionSize property should be an integer');
  }
  if (!(hue >= 1 && hue <= 360)) {
    throw new RangeError('hue in regionSize property should lie in [1, 360]');
  }

  if (!Number.isInteger(saturation)) {
    throw new TypeError('saturation in regionSize property should be an integer');
  }
  if (!(saturation >= 1 && saturation <= 100)) {
    throw new RangeError('saturation in regionSize property should lie in [1, 100]');
  }

  if (!Number.isInteger(lightness)) {
    throw new TypeError('lightness in regionSize property should be an integer');
  }
  if (!(lightness >= 1 && lightness <= 100)) {
    throw new RangeError('lightness in regionSize property should lie in [1, 100]');
  }

  const validatedBaseParameters = await validateBaseParameters(parameters);

  return { ...validatedBaseParameters, regionSize };
}

function hasUnknownPopularityProperties(parameters: PopularityParameters): Try<void> {
  if (parameters.imageElement) {
    return hasUnknownProperties(parameters, ['imageElement', 'numberOfColors', 'quality', 'regionSize']);
  }

  // parameters is of type RGBImageConfiguration
  return hasUnknownProperties(parameters, ['rgbImage', 'numberOfColors', 'quality', 'regionSize']);
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
