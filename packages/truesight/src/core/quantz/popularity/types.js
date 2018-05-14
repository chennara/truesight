// @flow

import type {
  RGBImageConfiguration as RGBImageBaseConfiguration,
  ImageElementConfiguration as ImageElementBaseConfiguration,
  ValidatedRGBImageConfiguration as ValidatedRGBImageBaseConfiguration,
  ValidatedImageElementConfiguration as ValidatedImageElementBaseConfiguration,
} from 'core/quantz/types';

// Used for configuring the popularity algorithm.
export type PopularityParameters = RGBImageConfiguration | ImageElementConfiguration;

// Used for configuring the popularity algorithm from an Image object.
export type RGBImageConfiguration = {|
  ...RGBImageBaseConfiguration,
  regionSize?: RegionSize,
|};

// Used for configuring the popularity algorithm from an ImageElement object.
export type ImageElementConfiguration = {|
  ...ImageElementBaseConfiguration,
  regionSize?: RegionSize,
|};

// PopularityParameters object in which the properties have already been validated.
export type ValidatedPopularityParameters = ValidatedRGBImageConfiguration | ValidatedImageElementConfiguration;

// RGBImageConfiguration object in which the properties have already been validated.
export type ValidatedRGBImageConfiguration = {|
  ...ValidatedRGBImageBaseConfiguration,
  regionSize: RegionSize,
|};

// ImageElementConfiguration object in which the properties have already been validated.
export type ValidatedImageElementConfiguration = {|
  ...ValidatedImageElementBaseConfiguration,
  regionSize: RegionSize,
|};

// Defines the region size in terms of the interval lengths for each of the channels in a HSLuvColor object.
export type RegionSize = [number, number, number];

// Defines the default region size dimensions for the popularity algorithm.
export const DEFAULT_REGION_SIZE: RegionSize = [15, 20, 20];
