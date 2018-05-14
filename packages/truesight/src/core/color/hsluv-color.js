// @flow

import hsluv from 'hsluv';

import { RGBColor } from './rgb-color';

export class HSLuvColor {
  channels: [number, number, number];

  constructor(channels: [number, number, number]) {
    this.channels = channels;
  }

  toString(): string {
    return this.channels.toString();
  }

  toRGBColor(): RGBColor {
    const rgbChannels = hsluv.hsluvToRgb(this.channels).map((channel) => Math.floor(channel * 255 + 0.5));
    const rgbColor = new RGBColor(rgbChannels);

    return rgbColor;
  }

  static fromString(colorString: string): HSLuvColor {
    const channels = colorString.split(',').map(Number);
    const color = new HSLuvColor([channels[0], channels[1], channels[2]]);

    return color;
  }

  get hue(): number {
    return this.channels[HUE_CHANNEL_INDEX];
  }

  get saturation(): number {
    return this.channels[SATURATION_CHANNEL_INDEX];
  }

  get lightness(): number {
    return this.channels[LIGHTNESS_CHANNEL_INDEX];
  }
}

// Index for accessing the hue channel in a HSLuvColor object.
export const HUE_CHANNEL_INDEX: 0 = 0;
// Index for accessing the saturation channel in a HSLuvColor object.
export const SATURATION_CHANNEL_INDEX: 1 = 1;
// Index for accessing the lightness channel in a HSLuvColor object.
export const LIGHTNESS_CHANNEL_INDEX: 2 = 2;
