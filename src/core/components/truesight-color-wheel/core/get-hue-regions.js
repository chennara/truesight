// @flow

import degreesToRadians from 'utils/math/degrees-to-radians';

export type HueRegion = {|
  hue: number,
  bounds: [number, number],
  angleInterval: [number, number],
|};

export const DEFAULT_HUE_REGION_SIZE = 45;

const hueRegions = [];

export default function getHueRegions(hueRegionSize: number = DEFAULT_HUE_REGION_SIZE): HueRegion[] {
  if (hueRegions.length === 0) {
    for (let i = 0; i < 360; i += hueRegionSize) {
      const [lowerBound, upperBound] = [i, i + hueRegionSize];
      const [startAngle, endAngle] = [degreesToRadians(lowerBound), degreesToRadians(upperBound)];

      hueRegions.push({
        hue: i,
        bounds: [lowerBound, upperBound],
        angleInterval: [startAngle, endAngle],
      });
    }
  }

  return hueRegions;
}
