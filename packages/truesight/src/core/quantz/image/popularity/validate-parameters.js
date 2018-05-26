// @flow

import type { ValidatedMedianCutParameters } from 'core/quantz/image/median-cut/types';
import type { Try } from 'utils/fp/neither';
import validateMedianCutParameters from 'core/quantz/image/median-cut/validate-parameters';

import type { PopularityParameters, ValidatedPopularityParameters } from './types';
import { DEFAULT_REGION_SIZE } from './types';

export default function validateParameters(parameters: PopularityParameters): Try<ValidatedPopularityParameters> {
  const unknownProperties = getUnknownProperties(parameters);

  if (unknownProperties.length !== 0) {
    return new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`);
  }

  const { regionSize = DEFAULT_REGION_SIZE } = parameters;
  const [hue, saturation, lightness] = regionSize;

  if (regionSize.length !== 3) {
    return new TypeError('regionSize property should be of type [number, number, number]');
  }

  if (!Number.isInteger(hue)) {
    return new TypeError('hue in regionSize property should be an integer');
  }
  if (!(hue >= 1 && hue <= 360)) {
    return new RangeError('hue in regionSize property should lie in [1, 360]');
  }

  if (!Number.isInteger(saturation)) {
    return new TypeError('saturation in regionSize property should be an integer');
  }
  if (!(saturation >= 1 && saturation <= 100)) {
    return new RangeError('saturation in regionSize property should lie in [1, 100]');
  }

  if (!Number.isInteger(lightness)) {
    return new TypeError('lightness in regionSize property should be an integer');
  }
  if (!(lightness >= 1 && lightness <= 100)) {
    return new RangeError('lightness in regionSize property should lie in [1, 100]');
  }

  const validatedBaseParameters = validateBaseParameters(parameters);

  if (validatedBaseParameters instanceof Error) {
    return validatedBaseParameters;
  }

  return {
    ...validatedBaseParameters,
    regionSize,
  };
}

function getUnknownProperties(parameters: PopularityParameters): string[] {
  const properties = Object.keys(parameters);

  const validBaseProperties = ['numberOfColors', 'quality', 'regionSize'];
  const validRGBImageProperties = ['rgbImage', ...validBaseProperties];
  const validImageElementProperties = ['imageElement', ...validBaseProperties];

  const unknownRGBImageProperties = properties.filter((property) => !validRGBImageProperties.includes(property));

  return unknownRGBImageProperties.length === 0
    ? unknownRGBImageProperties
    : properties.filter((property) => !validImageElementProperties.includes(property));
}

function validateBaseParameters(parameters: PopularityParameters): Try<ValidatedMedianCutParameters> {
  if (parameters.rgbImage) {
    const { rgbImage, numberOfColors, quality } = parameters;
    return validateMedianCutParameters({ rgbImage, numberOfColors, quality });
  }

  // parameters is of type ImageElementConfiguration
  const { imageElement, numberOfColors, quality } = parameters;
  return validateMedianCutParameters({ imageElement, numberOfColors, quality });
}
