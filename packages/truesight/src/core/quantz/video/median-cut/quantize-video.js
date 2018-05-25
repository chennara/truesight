// @flow

import type { VideoQuantizationParameters } from 'core/quantz/video/types';
import type { AsyncColorMapGenerator } from 'core/quantz/video/utils/parse-video';
import type { InverseColorMap, ColorPalette } from 'core/quantz/image/median-cut/quantize-image';
import parseVideo from 'core/quantz/video/utils/parse-video';
import { quantizeImage, reduceImage } from 'core/quantz/image/median-cut/quantize-image';

export function quantizeVideo(parameters: VideoQuantizationParameters): AsyncColorMapGenerator<InverseColorMap> {
  return parseVideo(quantizeImage, parameters);
}

export function reduceVideo(parameters: VideoQuantizationParameters): AsyncColorMapGenerator<ColorPalette> {
  return parseVideo(reduceImage, parameters);
}
