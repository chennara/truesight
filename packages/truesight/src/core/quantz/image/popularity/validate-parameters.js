// @flow

import type { Try } from 'utils/fp/neither';
import hasUnknownProperties from 'utils/collections/object/has-unknown-properties';

import type { ValidatedMedianCutParameters } from '../median-cut/types';
import validateMedianCutParameters from '../median-cut/validate-parameters';

import type { PopularityParameters, ValidatedPopularityParameters } from './types';
import {
  DEFAULT_REGION_SIZE,
  VALID_HUE_REGION_SIZES,
  VALID_LIGTHNESS_REGION_SIZES,
  VALID_SATURATION_REGION_SIZES,
} from './types';

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
  if (!VALID_HUE_REGION_SIZES.liesIn(hue)) {
    throw new RangeError(`hue in regionSize property should lie in ${VALID_HUE_REGION_SIZES.toString()}`);
  }

  if (!Number.isInteger(saturation)) {
    throw new TypeError('saturation in regionSize property should be an integer');
  }
  if (!VALID_SATURATION_REGION_SIZES.liesIn(saturation)) {
    throw new RangeError(`saturation in regionSize property should lie in ${VALID_SATURATION_REGION_SIZES.toString()}`);
  }

  if (!Number.isInteger(lightness)) {
    throw new TypeError('lightness in regionSize property should be an integer');
  }
  if (!VALID_LIGTHNESS_REGION_SIZES.liesIn(lightness)) {
    throw new RangeError(`lightness in regionSize property should lie in ${VALID_LIGTHNESS_REGION_SIZES.toString()}`);
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
