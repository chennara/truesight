// @flow

import type { ValidatedQuantizationParameters } from 'core/quantz/types';
import type { Try } from 'utils/fp/neither';
import validateQuantizationParameters from 'core/quantz/utils/validate-parameters';

import type { PopularityParameters, ValidatedPopularityParameters } from './types';
import { DEFAULT_REGION_SIZE } from './types';

export default function validateParameters(parameters: PopularityParameters): Try<ValidatedPopularityParameters> {
  const { regionSize = DEFAULT_REGION_SIZE } = parameters;
  const [hue, saturation, lightness] = regionSize;

  if (regionSize.length !== 3) {
    return RangeError('regionSize should be of type [number, number, number]');
  }

  if (!Number.isInteger(hue)) {
    return TypeError('hue in regionSize should be an integer');
  }
  if (!(hue >= 1 && hue <= 360)) {
    return RangeError('hue in regionSize should lie in [1, 360]');
  }

  if (!Number.isInteger(saturation)) {
    return TypeError('saturation in regionSize should be an integer');
  }
  if (!(saturation >= 1 && saturation <= 100)) {
    return RangeError('saturation in regionSize should lie in [1, 100]');
  }

  if (!Number.isInteger(lightness)) {
    return TypeError('lightness in regionSize should be an integer');
  }
  if (!(lightness >= 1 && lightness <= 100)) {
    return RangeError('lightness in regionSize should lie in [1, 100]');
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

function validateBaseParameters(parameters: PopularityParameters): Try<ValidatedQuantizationParameters> {
  if (parameters.rgbImage) {
    const { rgbImage, numberOfColors, quality } = parameters;
    return validateQuantizationParameters({ rgbImage, numberOfColors, quality });
  }

  // parameters is of type ImageElementConfiguration
  const { imageElement, numberOfColors, quality } = parameters;
  return validateQuantizationParameters({ imageElement, numberOfColors, quality });
}
