// @flow

import type { ImageQuantizationParameters } from 'core/image/quantz/types';
import type { Try } from 'utils/fp/neither';
import validateImageQuantizationParameters from 'core/image/quantz/utils/validate-parameters';

import type { PopularityParameters } from './types';
import { DEFAULT_REGION_SIZE } from './types';

export default function validateParameters(parameters: PopularityParameters): Try<PopularityParameters> {
  const { regionSize = DEFAULT_REGION_SIZE } = parameters;
  const [hue, saturation, lightness] = regionSize;

  if (regionSize.length !== 3) {
    return new RangeError('regionSize should be of type [number, number, number]');
  }

  if (!Number.isInteger(hue)) {
    return new TypeError('hue in regionSize should be an integer');
  }
  if (!(hue >= 1 && hue <= 360)) {
    return new RangeError('hue in regionSize should lie in [1, 360]');
  }

  if (!Number.isInteger(saturation)) {
    return new TypeError('saturation in regionSize should be an integer');
  }
  if (!(saturation >= 1 && saturation <= 100)) {
    return new RangeError('saturation in regionSize should lie in [1, 100]');
  }

  if (!Number.isInteger(lightness)) {
    return new TypeError('lightness in regionSize should be an integer');
  }
  if (!(lightness >= 1 && lightness <= 100)) {
    return new RangeError('lightness in regionSize should lie in [1, 100]');
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

function validateBaseParameters(parameters: PopularityParameters): Try<ImageQuantizationParameters> {
  if (parameters.rgbImage) {
    const { rgbImage, numberOfColors, quality } = parameters;
    return validateImageQuantizationParameters({ rgbImage, numberOfColors, quality });
  }

  // parameters is of type ImageElementConfiguration
  const { imageElement, numberOfColors, quality } = parameters;
  return validateImageQuantizationParameters({ imageElement, numberOfColors, quality });
}
