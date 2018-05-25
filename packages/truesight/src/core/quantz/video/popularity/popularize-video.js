// @flow

import type { VideoParsingParameters } from 'core/quantz/video/types';
import type { AsyncFrameResultGenerator } from 'core/quantz/video/utils/parse-video';
import type { ColorPalette } from 'core/quantz/image/popularity/popularize-image';
import parseVideo from 'core/quantz/video/utils/parse-video';
import popularizeImage from 'core/quantz/image/popularity/popularize-image';

import type { PopularityVideoParameters, PopularityBaseParameters } from './types';

export default function popularizeVideo(
  parameters: PopularityVideoParameters
): AsyncFrameResultGenerator<ColorPalette> {
  const [videoParsingParameters, medianCutBaseParameters] = extractParameters(parameters);

  const popularizeImageWrapper = (canvasElement) =>
    popularizeImage({
      imageElement: canvasElement,
      ...medianCutBaseParameters,
    });

  return parseVideo(videoParsingParameters, popularizeImageWrapper);
}

function extractParameters(parameters: PopularityVideoParameters): [VideoParsingParameters, PopularityBaseParameters] {
  const { videoElement, framesPerSecond, numberOfColors, quality, regionSize } = parameters;

  return [{ videoElement, framesPerSecond }, { numberOfColors, quality, regionSize }];
}
