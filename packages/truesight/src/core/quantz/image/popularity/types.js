// @flow

import { Interval } from 'utils/collections/interval';

import type {
  RGBImageConfiguration as RGBImageBaseConfiguration,
  ImageElementConfiguration as ImageElementBaseConfiguration,
  ValidatedRGBImageConfiguration as ValidatedRGBImageBaseConfiguration,
  ValidatedImageElementConfiguration as ValidatedImageElementBaseConfiguration,
} from '../median-cut/types';

// Used for configuring the popularity algorithm.
export type PopularityParameters = RGBImageConfiguration | ImageElementConfiguration;

// Used for configuring the popularity algorithm from a RGBImage object.
export type RGBImageConfiguration = {|
  ...RGBImageBaseConfiguration,
  regionSize?: RegionSize,
|};

// Used for configuring the popularity algorithm from an ImageElement object.
export type ImageElementConfiguration = {|
  ...ImageElementBaseConfiguration,
  regionSize?: RegionSize,
|};

// PopularityParameters object in which the properties have been validated.
export type ValidatedPopularityParameters = ValidatedRGBImageConfiguration | ValidatedImageElementConfiguration;

// RGBImageConfiguration object in which the properties have been validated.
export type ValidatedRGBImageConfiguration = {|
  ...ValidatedRGBImageBaseConfiguration,
  regionSize: RegionSize,
|};

// RGBImageConfiguration object in which the properties have been validated.
export type ValidatedImageElementConfiguration = {|
  ...ValidatedImageElementBaseConfiguration,
  regionSize: RegionSize,
|};

// Region size in terms of interval lengths for each of the channels in an HSLuvColor object.
export type RegionSize = [number, number, number];

// Default region size dimensions for the popularity algorithm.
export const DEFAULT_REGION_SIZE: RegionSize = [15, 20, 20];

// An interval of valid hue region sizes.
export const VALID_HUE_REGION_SIZES = new Interval(1, 360);
// An interval of valid saturation region sizes.
export const VALID_SATURATION_REGION_SIZES = new Interval(1, 100);
// An interval of valid lightness region sizes.
export const VALID_LIGTHNESS_REGION_SIZES = new Interval(1, 100);
