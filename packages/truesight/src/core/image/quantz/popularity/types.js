// @flow

import type {
  RGBImageConfiguration as RGBImageBaseConfiguration,
  ImageElementConfiguration as ImageElementBaseConfiguration,
} from 'core/image/quantz/types';

// Used for configuring the popularity algorithm.
export type PopularityParameters = RGBImageConfiguration | ImageElementConfiguration;

// Used for configuring the popularity algorithm from an Image object.
export type RGBImageConfiguration = {|
  ...RGBImageBaseConfiguration,
  regionSize: RegionSize,
|};

// Used for configuring the popularity algorithm from an ImageElement object.
export type ImageElementConfiguration = {|
  ...ImageElementBaseConfiguration,
  regionSize: RegionSize,
|};

// Defines the region size in terms of interval lengths for each of the channels in an HSLuvColor object.
export type RegionSize = [number, number, number];

// Defines the default region size dimensions for the popularity algorithm.
export const DEFAULT_REGION_SIZE: RegionSize = [15, 20, 20];
