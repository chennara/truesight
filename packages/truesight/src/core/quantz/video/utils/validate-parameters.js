// @flow

import type { VideoParsingParameters, ValidatedVideoParsingParameters } from 'core/quantz/video/types';
import type { Try } from 'utils/fp/neither';
import { DEFAULT_SECONDS_BETWEEN_FRAMES } from 'core/quantz/video/types';

export default function validateParameters(parameters: VideoParsingParameters): Try<ValidatedVideoParsingParameters> {
  const unknownProperties = getUnknownProperties(parameters);

  if (unknownProperties.length !== 0) {
    return new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`);
  }

  const { videoElement, secondsBetweenFrames = DEFAULT_SECONDS_BETWEEN_FRAMES } = parameters;

  if (!videoElement) {
    return new RangeError('parameters argument should include videoElement property');
  }
  if (!(videoElement instanceof HTMLVideoElement)) {
    return new TypeError('videoElement property should be of type HTMLVideoElement');
  }

  // The browser won't dynamically set the width or height attribute value in video elements.
  if (videoElement.width === 0) {
    return new RangeError('width attribute in videoElement property is 0');
  }
  if (videoElement.height === 0) {
    return new RangeError('height attribute in videoElement property is 0');
  }

  if (!Number.isFinite(secondsBetweenFrames)) {
    return new TypeError('secondsBetweenFrames property should be a number');
  }
  if (secondsBetweenFrames <= 0) {
    return new RangeError('secondsBetweenFrames property should be greater than 0');
  }

  return { videoElement, secondsBetweenFrames };
}

function getUnknownProperties(parameters: VideoParsingParameters): string[] {
  const properties = Object.keys(parameters);
  const validProperties = ['videoElement', 'secondsBetweenFrames'];

  return properties.filter((property) => !validProperties.includes(property));
}
