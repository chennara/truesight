// @flow

import type { VideoQuantizationParameters } from 'core/video/quantz/types';
import type { AsyncColorMapGenerator } from 'core/video/quantz/utils/parse-video';
import type { InverseColorMap, ColorPalette } from 'core/image/quantz/median-cut/quantize-image';
import parseVideo from 'core/video/quantz/utils/parse-video';
import { quantizeImage, reduceImage } from 'core/image/quantz/median-cut/quantize-image';

export function quantizeVideo(parameters: VideoQuantizationParameters): AsyncColorMapGenerator<InverseColorMap> {
  return parseVideo(quantizeImage, parameters);
}

export function reduceVideo(parameters: VideoQuantizationParameters): AsyncColorMapGenerator<ColorPalette> {
  return parseVideo(reduceImage, parameters);
}
