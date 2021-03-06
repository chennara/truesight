// @flow

import type { InverseColorMap, ColorPalette } from 'core/quantz/image/median-cut/quantize-image';
import { quantizeImage, reduceImage } from 'core/quantz/image/median-cut/quantize-image';

import type { VideoParsingParameters } from '../types';
import type { AsyncParsingResultGenerator } from '../utils/parse-video';
import parseVideo from '../utils/parse-video';

import type { MedianCutVideoParameters, MedianCutBaseParameters } from './types';

export function quantizeVideo(parameters: MedianCutVideoParameters): AsyncParsingResultGenerator<InverseColorMap> {
  const [videoParsingParameters, medianCutBaseParameters] = extractParameters(parameters);

  const quantizeImageWrapper = (canvasElement) =>
    quantizeImage({
      imageElement: canvasElement,
      ...medianCutBaseParameters,
    });

  return parseVideo(videoParsingParameters, quantizeImageWrapper);
}

export function reduceVideo(parameters: MedianCutVideoParameters): AsyncParsingResultGenerator<ColorPalette> {
  const [videoParsingParameters, medianCutBaseParameters] = extractParameters(parameters);

  const reduceImageWrapper = (canvasElement) =>
    reduceImage({
      imageElement: canvasElement,
      ...medianCutBaseParameters,
    });

  return parseVideo(videoParsingParameters, reduceImageWrapper);
}

function extractParameters(parameters: MedianCutVideoParameters): [VideoParsingParameters, MedianCutBaseParameters] {
  const { videoElement, secondsBetweenFrames, numberOfColors, quality } = parameters;

  return [{ videoElement, secondsBetweenFrames }, { numberOfColors, quality }];
}
