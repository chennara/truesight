// @flow

import type { VideoQuantizationParameters } from 'core/video/quantz/types';
import type { AsyncColorMapGenerator } from 'core/video/quantz/utils/parse-video';
import type { ColorPalette } from 'core/image/quantz/popularity/popularize-image';
import parseVideo from 'core/video/quantz/utils/parse-video';
import popularizeImage from 'core/image/quantz/popularity/popularize-image';

export function popularizeVideo(parameters: VideoQuantizationParameters): AsyncColorMapGenerator<ColorPalette> {
  return parseVideo(popularizeImage, parameters);
}
