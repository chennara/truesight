// @flow

import { HSLuvColor } from 'core/color/hsluv-color';
import { RGBColor, RED_CHANNEL_INDEX, GREEN_CHANNEL_INDEX, BLUE_CHANNEL_INDEX } from 'core/color/rgb-color';

import type { ImageElement } from './image-element';
import { RGBImage } from './rgb-image';
import getImageData from './get-image-data';

export class HSLuvImage {
  data: HSLuvColor[];

  constructor(data: HSLuvColor[]) {
    this.data = data;
  }

  static fromRGBImage(rgbImage: RGBImage, quality: number): HSLuvImage {
    const hsluvImageData = [];

    const numberOfPixelsToSkip = quality - 1;

    for (let i = numberOfPixelsToSkip; i < rgbImage.data.length; i += 1 + numberOfPixelsToSkip) {
      const rgbChannels = [rgbImage.data[i].red, rgbImage.data[i].green, rgbImage.data[i].blue];
      const rgbColor = new RGBColor(rgbChannels);
      const hsluvColor = rgbColor.toHSLuvColor();

      hsluvImageData.push(hsluvColor);
    }

    return new HSLuvImage(hsluvImageData);
  }

  static fromImageElement(imageElement: ImageElement, quality: number): HSLuvImage {
    const hsluvImageData = [];

    const rgbaImageData = getImageData(imageElement);
    const numberOfEntriesToSkip = 4 * (quality - 1);

    for (let i = numberOfEntriesToSkip; i < rgbaImageData.length; i += 4 + numberOfEntriesToSkip) {
      const rgbChannels = [
        rgbaImageData[i + RED_CHANNEL_INDEX],
        rgbaImageData[i + GREEN_CHANNEL_INDEX],
        rgbaImageData[i + BLUE_CHANNEL_INDEX],
      ];
      const rgbColor = new RGBColor(rgbChannels);
      const hsluvColor = rgbColor.toHSLuvColor();

      hsluvImageData.push(hsluvColor);
    }

    return new HSLuvImage(hsluvImageData);
  }
}
