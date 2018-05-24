// @flow

import { RGBImage } from './core/image/types/rgb-image';
import ImageQuantizationAPI from './core/image/quantz';
import VideoQuantizationAPI from './core/video/quantz';

export default {
  RGBImage,
  ...ImageQuantizationAPI,
  ...VideoQuantizationAPI,
};
