// @flow

import loadVideo from 'core/video/load-video';

import type { VideoParsingParameters, ValidatedVideoParsingParameters } from '../types';
import { DEFAULT_SECONDS_BETWEEN_FRAMES } from '../types';

export default async function validateVideoParsingParameters(
  parameters: VideoParsingParameters
): Promise<ValidatedVideoParsingParameters> {
  const unknownProperties = getUnknownProperties(parameters);

  if (unknownProperties.length !== 0) {
    return Promise.reject(new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`));
  }

  const { videoElement, secondsBetweenFrames = DEFAULT_SECONDS_BETWEEN_FRAMES } = parameters;

  if (!videoElement) {
    return Promise.reject(new RangeError('parameters argument should include videoElement property'));
  }
  if (!(videoElement instanceof HTMLVideoElement)) {
    return Promise.reject(new TypeError('videoElement property should be of type HTMLVideoElement'));
  }

  try {
    await loadVideo(videoElement);
  } catch (error) {
    return Promise.reject(error);
  }

  // The browser won't dynamically set the width or height attribute value in video elements.
  if (videoElement.width === 0) {
    return Promise.reject(new RangeError('width attribute in videoElement property is 0'));
  }
  if (videoElement.height === 0) {
    return Promise.reject(new RangeError('height attribute in videoElement property is 0'));
  }

  if (!Number.isFinite(secondsBetweenFrames)) {
    return Promise.reject(new TypeError('secondsBetweenFrames property should be a number'));
  }
  if (secondsBetweenFrames <= 0) {
    return Promise.reject(new RangeError('secondsBetweenFrames property should be greater than 0'));
  }

  return Promise.resolve({ videoElement, secondsBetweenFrames });
}

function getUnknownProperties(parameters: VideoParsingParameters): string[] {
  const properties = Object.keys(parameters);
  const validProperties = ['videoElement', 'secondsBetweenFrames'];

  return properties.filter((property) => !validProperties.includes(property));
}
