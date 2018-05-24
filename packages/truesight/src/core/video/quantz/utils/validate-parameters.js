// @flow

import type { VideoQuantizationParameters } from 'core/video/quantz/types';
import type { Try } from 'utils/fp/neither';
import { VALID_FRAMES_PER_SECONDS, DEFAULT_FRAMES_PER_SECOND } from 'core/video/quantz/types';

export default function validateParameters(parameters: VideoQuantizationParameters): Try<VideoQuantizationParameters> {
  const { videoElement, framesPerSecond = DEFAULT_FRAMES_PER_SECOND } = parameters;

  if (!videoElement) {
    return new RangeError('parameters should include videoElement property');
  }
  if (!(videoElement instanceof HTMLVideoElement)) {
    return new TypeError('videoElement should be of type HTMLVideoElement');
  }

  if (!Number.isInteger(framesPerSecond)) {
    return new TypeError('framesPerSecond should be an integer');
  }
  if (!VALID_FRAMES_PER_SECONDS.liesIn(framesPerSecond)) {
    return new RangeError(`framesPerSecond should lie in ${VALID_FRAMES_PER_SECONDS.toString()}`);
  }

  return Object.assign(parameters, { framesPerSecond });
}
