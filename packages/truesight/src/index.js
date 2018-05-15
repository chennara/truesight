// @flow

import { RGBImage } from './core/image/types/rgb-image';
import ImageQuantization from './core/image/quantz';

export default {
  RGBImage,
  ...ImageQuantization,
};
