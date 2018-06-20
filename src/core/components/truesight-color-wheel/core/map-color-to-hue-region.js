// @flow

import type { HueRegion } from './get-hue-regions';
import getHueRegions from './get-hue-regions';

export type HSLColor = [number, number, number];

export default function mapColorToHueRegion(color: HSLColor, hueRegions: HueRegion[] = getHueRegions()): HueRegion {
  const mappedHueRegion =
    hueRegions.find((hueRegion) => {
      if (color[0] === 360) {
        return hueRegions[0];
      }

      return color[0] >= hueRegion.bounds[0] && color[0] < hueRegion.bounds[1];
    }) || hueRegions[0];

  return mappedHueRegion;
}
