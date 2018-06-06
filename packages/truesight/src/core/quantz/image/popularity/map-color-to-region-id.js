// @flow

import {
  HSLuvColor,
  HUE_CHANNEL_INDEX,
  SATURATION_CHANNEL_INDEX,
  LIGHTNESS_CHANNEL_INDEX,
} from 'core/color/hsluv-color';

import type { RegionSize } from './types';

// HSLuvColor objects with lightness values smaller than this upper bound are parsed as the color black.
const BLACK_LIGHTNESS_UPPER_BOUND = 5;
// HSLuvColor objects with lightness values greater than this lower bound are parsed as the color white.
const WHITE_LIGHTNESS_LOWER_BOUND = 95;
// HSLuvColor objects with saturation values smaller than this are parsed as the color gray.
const GRAY_SATURATION_UPPER_BOUND = 10;

export default function mapColorToRegionID(color: HSLuvColor, regionSize: RegionSize): string {
  const representativeColor = color;

  if (color.lightness >= 0 && color.lightness < BLACK_LIGHTNESS_UPPER_BOUND) {
    representativeColor.channels = [0, 0, 0];
  } else if (color.lightness > WHITE_LIGHTNESS_LOWER_BOUND && color.lightness <= 100) {
    representativeColor.channels = [0, 0, 100];
  } else if (color.saturation >= 0 && color.saturation < GRAY_SATURATION_UPPER_BOUND) {
    representativeColor.channels = [0, 0, color.lightness];
  }

  const hueIntervals = [];
  for (let i = 0; i < 360 + regionSize[HUE_CHANNEL_INDEX]; i += regionSize[HUE_CHANNEL_INDEX]) {
    hueIntervals.push(Math.min(i, 360));
  }

  const saturationIntervals = [0];
  for (
    let i = GRAY_SATURATION_UPPER_BOUND;
    i < 100 + regionSize[SATURATION_CHANNEL_INDEX];
    i += regionSize[SATURATION_CHANNEL_INDEX]
  ) {
    saturationIntervals.push(Math.min(i, 100));
  }

  const lightnessIntervals = [0];
  for (
    let i = BLACK_LIGHTNESS_UPPER_BOUND;
    i < WHITE_LIGHTNESS_LOWER_BOUND + regionSize[LIGHTNESS_CHANNEL_INDEX];
    i += regionSize[LIGHTNESS_CHANNEL_INDEX]
  ) {
    lightnessIntervals.push(Math.min(i, WHITE_LIGHTNESS_LOWER_BOUND));
  }
  lightnessIntervals.push(100);

  return [
    mapChannelToRegionID(hueIntervals, representativeColor.hue),
    mapChannelToRegionID(saturationIntervals, representativeColor.saturation),
    mapChannelToRegionID(lightnessIntervals, representativeColor.lightness),
  ].join(',');
}

// The return value should be interpreted as a half-open interval of channel values in (begin, end].
// The first region in the intervals parameter includes the 0 channel value and should thus be interpreted as [0, end].
function mapChannelToRegionID(intervals: number[], channel: number): string {
  let i = channel === 0 ? 1 : 0;
  while (channel > intervals[i] && i < intervals.length) {
    i += 1;
  }

  return [intervals[i - 1], intervals[i]].toString();
}
