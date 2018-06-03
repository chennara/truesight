// @flow

import hsluv from 'hsluv';

import { RGBColor } from './rgb-color';
import { HSLuvColor } from './hsluv-color';

export function rgbToHSLuvColor(color: RGBColor): HSLuvColor {
  const rgbChannels = color.channels.map((channel) => channel / 255);
  const hsluvChannels = hsluv.rgbToHsluv(rgbChannels);
  const hsluvColor = new HSLuvColor(hsluvChannels);

  return hsluvColor;
}

export function hsluvToRgbColor(color: HSLuvColor): RGBColor {
  const rgbChannels = hsluv.hsluvToRgb(color.channels).map((channel) => Math.floor(channel * 255 + 0.5));
  const rgbColor = new RGBColor(rgbChannels);

  return rgbColor;
}
