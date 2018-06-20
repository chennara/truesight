// @flow

import hsluv from 'hsluv';

export type RGBChannels = [number, number, number];
export type HSLuvChannels = [number, number, number];

export default function rgbToHSLuv(color: RGBChannels): HSLuvChannels {
  const rgbChannels = color.map((channel) => channel / 255);
  const hsluvChannels = hsluv.rgbToHsluv(rgbChannels);

  return hsluvChannels;
}
