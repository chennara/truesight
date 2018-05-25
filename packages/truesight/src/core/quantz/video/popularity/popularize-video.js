// @flow

import type { VideoQuantizationParameters } from 'core/quantz/video/types';
import type { AsyncColorMapGenerator } from 'core/quantz/video/utils/parse-video';
import type { ColorPalette } from 'core/quantz/image/popularity/popularize-image';
import parseVideo from 'core/quantz/video/utils/parse-video';
import popularizeImage from 'core/quantz/image/popularity/popularize-image';

export default function popularizeVideo(parameters: VideoQuantizationParameters): AsyncColorMapGenerator<ColorPalette> {
  return parseVideo(popularizeImage, parameters);
}
