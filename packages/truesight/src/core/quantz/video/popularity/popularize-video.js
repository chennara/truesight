// @flow

import type { ColorPalette } from 'core/quantz/image/popularity/popularize-image';
import popularizeImage from 'core/quantz/image/popularity/popularize-image';

import type { VideoParsingParameters } from '../types';
import type { AsyncParsingResultGenerator } from '../utils/parse-video';
import parseVideo from '../utils/parse-video';

import type { PopularityVideoParameters, PopularityBaseParameters } from './types';

export default function popularizeVideo(
  parameters: PopularityVideoParameters
): AsyncParsingResultGenerator<ColorPalette> {
  const [videoParsingParameters, medianCutBaseParameters] = extractParameters(parameters);

  const popularizeImageWrapper = (canvasElement) =>
    popularizeImage({
      imageElement: canvasElement,
      ...medianCutBaseParameters,
    });

  return parseVideo(videoParsingParameters, popularizeImageWrapper);
}

function extractParameters(parameters: PopularityVideoParameters): [VideoParsingParameters, PopularityBaseParameters] {
  const { videoElement, secondsBetweenFrames, numberOfColors, quality, regionSize } = parameters;

  return [{ videoElement, secondsBetweenFrames }, { numberOfColors, quality, regionSize }];
}
