// @flow

import { RGBImage } from './core/image/rgb-image';
import ImageQuantizationAPI from './core/quantz/image';
import VideoQuantizationAPI from './core/quantz/video';

export default {
  RGBImage,
  ...ImageQuantizationAPI,
  ...VideoQuantizationAPI,
};
