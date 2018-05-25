// @flow

import {
  HSLuvColor,
  HUE_CHANNEL_INDEX,
  SATURATION_CHANNEL_INDEX,
  LIGHTNESS_CHANNEL_INDEX,
} from 'core/color/hsluv-color';

import type { RegionSize } from './types';

export default function mapColorToRegionID(color: HSLuvColor, regionSize: RegionSize): string {
  const hueIntervals = [];
  for (let i = 0; i < 360 + regionSize[HUE_CHANNEL_INDEX]; i += regionSize[HUE_CHANNEL_INDEX]) {
    hueIntervals.push(Math.min(i, 360));
  }

  const saturationIntervals = [];
  for (let i = 0; i < 100 + regionSize[SATURATION_CHANNEL_INDEX]; i += regionSize[SATURATION_CHANNEL_INDEX]) {
    saturationIntervals.push(Math.min(i, 100));
  }

  const lightnessIntervals = [];
  for (let i = 0; i < 100 + regionSize[LIGHTNESS_CHANNEL_INDEX]; i += regionSize[LIGHTNESS_CHANNEL_INDEX]) {
    lightnessIntervals.push(Math.min(i, 100));
  }

  return [
    mapChannelToRegionID(hueIntervals, color.hue),
    mapChannelToRegionID(saturationIntervals, color.saturation),
    mapChannelToRegionID(lightnessIntervals, color.lightness),
  ].join(',');
}

// The return value should be interpreted as a half-open interval of channel values in [begin, end).
function mapChannelToRegionID(intervals: number[], channel: number): string {
  let i = 0;
  while (channel >= intervals[i] && i < intervals.length) {
    i += 1;
  }

  return [intervals[i - 1], intervals[i]].toString();
}
