// @flow

import type { VideoParsingParameters } from 'core/quantz/video/types';
import type { AsyncFrameResultGenerator } from 'core/quantz/video/utils/parse-video';
import type { InverseColorMap, ColorPalette } from 'core/quantz/image/median-cut/quantize-image';
import parseVideo from 'core/quantz/video/utils/parse-video';
import { quantizeImage, reduceImage } from 'core/quantz/image/median-cut/quantize-image';

import type { MedianCutVideoParameters, MedianCutBaseParameters } from './types';

export function quantizeVideo(parameters: MedianCutVideoParameters): AsyncFrameResultGenerator<InverseColorMap> {
  const [videoParsingParameters, medianCutBaseParameters] = extractParameters(parameters);

  const quantizeImageWrapper = (canvasElement) =>
    quantizeImage({
      imageElement: canvasElement,
      ...medianCutBaseParameters,
    });

  return parseVideo(videoParsingParameters, quantizeImageWrapper);
}

export function reduceVideo(parameters: MedianCutVideoParameters): AsyncFrameResultGenerator<ColorPalette> {
  const [videoParsingParameters, medianCutBaseParameters] = extractParameters(parameters);

  const reduceImageWrapper = (canvasElement) =>
    reduceImage({
      imageElement: canvasElement,
      ...medianCutBaseParameters,
    });

  return parseVideo(videoParsingParameters, reduceImageWrapper);
}

function extractParameters(parameters: MedianCutVideoParameters): [VideoParsingParameters, MedianCutBaseParameters] {
  const { videoElement, framesPerSecond, numberOfColors, quality } = parameters;

  return [{ videoElement, framesPerSecond }, { numberOfColors, quality }];
}
