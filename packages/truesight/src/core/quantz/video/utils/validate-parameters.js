// @flow

import type { VideoParsingParameters, ValidatedVideoParsingParameters } from 'core/quantz/video/types';
import type { Try } from 'utils/fp/neither';
import { VALID_FRAMES_PER_SECONDS, DEFAULT_FRAMES_PER_SECOND } from 'core/quantz/video/types';

export default function validateParameters(parameters: VideoParsingParameters): Try<ValidatedVideoParsingParameters> {
  const unknownProperties = getUnknownProperties(parameters);

  if (unknownProperties.length !== 0) {
    return new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`);
  }

  const { videoElement, framesPerSecond = DEFAULT_FRAMES_PER_SECOND } = parameters;

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

  if (!Number.isInteger(framesPerSecond)) {
    return new TypeError('framesPerSecond property should be an integer');
  }
  if (!VALID_FRAMES_PER_SECONDS.liesIn(framesPerSecond)) {
    return new RangeError(`framesPerSecond property should lie in ${VALID_FRAMES_PER_SECONDS.toString()}`);
  }

  return { videoElement, framesPerSecond };
}

function getUnknownProperties(parameters: VideoParsingParameters): string[] {
  const properties = Object.keys(parameters);
  const validProperties = ['videoElement', 'framesPerSecond'];

  return properties.filter((property) => !validProperties.includes(property));
}
