// @flow

import { RGBColor, RED_CHANNEL_INDEX, GREEN_CHANNEL_INDEX, BLUE_CHANNEL_INDEX } from 'core/color/rgb-color';
import getImageData from 'core/image/get-image-data';

import type { ImageElement } from './image-element';

export class RGBImage {
  data: RGBColor[];

  constructor(data: RGBColor[]) {
    this.data = data;
  }

  static async fromImageElement(imageElement: ImageElement, quality: number): Promise<RGBImage> {
    const rgbImageData = [];

    const rgbaImageData = await getImageData(imageElement);
    const numberOfEntriesToSkip = 4 * (quality - 1);

    for (let i = numberOfEntriesToSkip; i < rgbaImageData.length; i += 4 + numberOfEntriesToSkip) {
      const rgbColor = new RGBColor([
        rgbaImageData[i + RED_CHANNEL_INDEX],
        rgbaImageData[i + GREEN_CHANNEL_INDEX],
        rgbaImageData[i + BLUE_CHANNEL_INDEX],
      ]);

      rgbImageData.push(rgbColor);
    }

    return new RGBImage(rgbImageData);
  }
}
