// @flow

import loadVideo from 'core/video/load-video';
import hasUnknownProperties from 'utils/collections/object/has-unknown-properties';

import type { VideoParsingParameters, ValidatedVideoParsingParameters } from '../types';
import { DEFAULT_SECONDS_BETWEEN_FRAMES } from '../types';

export default async function validateVideoParsingParameters(
  parameters: VideoParsingParameters
): Promise<ValidatedVideoParsingParameters> {
  const unknownProperties = hasUnknownProperties(parameters, ['videoElement', 'secondsBetweenFrames']);

  if (unknownProperties instanceof Error) {
    throw unknownProperties;
  }

  const { videoElement, secondsBetweenFrames = DEFAULT_SECONDS_BETWEEN_FRAMES } = parameters;

  if (!videoElement) {
    throw new RangeError('parameters argument should include videoElement property');
  }
  if (!(videoElement instanceof HTMLVideoElement)) {
    throw new TypeError('videoElement property should be of type HTMLVideoElement');
  }

  await loadVideo(videoElement);

  // The browser won't dynamically set the width or height attribute value in video elements.
  if (videoElement.width === 0) {
    throw new RangeError('width attribute in videoElement property is 0');
  }
  if (videoElement.height === 0) {
    throw new RangeError('height attribute in videoElement property is 0');
  }

  if (!Number.isFinite(secondsBetweenFrames)) {
    throw new TypeError('secondsBetweenFrames property should be a number');
  }
  if (secondsBetweenFrames <= 0) {
    throw new RangeError('secondsBetweenFrames property should be greater than 0');
  }

  return { videoElement, secondsBetweenFrames };
}
