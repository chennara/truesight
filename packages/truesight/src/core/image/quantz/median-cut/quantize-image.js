// @flow

import { RGBImage } from 'core/image/types/rgb-image';
import { RGBColor, RED_CHANNEL_INDEX, GREEN_CHANNEL_INDEX, BLUE_CHANNEL_INDEX } from 'core/color/rgb-color';

import type { MedianCutParameters } from './types';
import validateParameters from './validate-parameters';

// Maps each color in the image to its representative color.
export type InverseColorMap = {|
  sourceColor: RGBColor,
  representativeColor: RGBColor,
|}[];

// A histogram of the most dominant colors in an image.
export type ColorPalette = {|
  color: RGBColor,
  population: number,
|}[];

// A bounded region in the original source image.
type Vbox = RGBColor[];

// Enum for safely accessing a channel in a RGBColor object.
type RGBIndex = typeof RED_CHANNEL_INDEX | typeof GREEN_CHANNEL_INDEX | typeof BLUE_CHANNEL_INDEX;

export function quantizeImage(parameters: MedianCutParameters): Promise<InverseColorMap> {
  return runMedianCut(parameters, buildInverseColorMap);
}

export function reduceImage(parameters: MedianCutParameters): Promise<ColorPalette> {
  return runMedianCut(parameters, buildColorPalette);
}

async function runMedianCut<T>(parameters: MedianCutParameters, buildMap: (Vbox[]) => T): Promise<T> {
  const validatedParameters = validateParameters(parameters);
  if (validatedParameters instanceof Error) {
    return Promise.reject(validatedParameters);
  }

  const rgbImage = await extractRGBImage(validatedParameters);
  const vboxes = findMostDominantColors(rgbImage, validatedParameters.numberOfColors);
  const resultingMap = buildMap(vboxes);

  return resultingMap;
}

async function extractRGBImage(parameters: MedianCutParameters): Promise<RGBImage> {
  return parameters.rgbImage
    ? parameters.rgbImage
    : RGBImage.fromImageElement(parameters.imageElement, parameters.quality);
}

function findMostDominantColors(image: RGBImage, numberOfColors: number): Vbox[] {
  let vboxes = [image.data];

  for (let i = 0; i < numberOfColors - 1; i += 1) {
    const largestVbox = findLargestVbox(vboxes);
    const longestAxis = findLongestAxis(largestVbox);
    const splittedVboxes = splitAlongAxis(largestVbox, longestAxis);

    vboxes.splice(vboxes.indexOf(largestVbox), 1);
    vboxes = vboxes.concat(splittedVboxes);
  }

  return vboxes;
}

function findLargestVbox(vboxes: Vbox[]): Vbox {
  return vboxes.reduce((previous, current) => (current.length > previous.length ? current : previous));
}

function findLongestAxis(vbox: Vbox): RGBIndex {
  class RGBColorAxis {
    axis: RGBIndex;
    minMax: [number, number];

    constructor(axis: RGBIndex) {
      this.axis = axis;
      this.minMax = [255, 0];
    }

    updateMinMax(value: number) {
      this.minMax = [Math.min(value, this.minMax[0]), Math.max(value, this.minMax[1])];
    }

    get width(): number {
      return this.minMax[1] - this.minMax[0];
    }
  }

  const rgbColorAxes = [
    new RGBColorAxis(RED_CHANNEL_INDEX),
    new RGBColorAxis(GREEN_CHANNEL_INDEX),
    new RGBColorAxis(BLUE_CHANNEL_INDEX),
  ];

  vbox.forEach((color) => {
    rgbColorAxes[RED_CHANNEL_INDEX].updateMinMax(color.red);
    rgbColorAxes[GREEN_CHANNEL_INDEX].updateMinMax(color.green);
    rgbColorAxes[BLUE_CHANNEL_INDEX].updateMinMax(color.blue);
  });

  const longestAxis = rgbColorAxes.reduce((previous, current) => (current.width > previous.width ? current : previous));

  return longestAxis.axis;
}

function splitAlongAxis(vbox: Vbox, axis: RGBIndex): [Vbox, Vbox] {
  const median = findAxisMedian(vbox, axis);
  const vboxes = splitOnAxisMedian(vbox, axis, median);

  return vboxes;
}

function findAxisMedian(vbox: Vbox, axis: RGBIndex): number {
  const extractedChannelValues = vbox
    .map((color) => color.channels[axis])
    .sort((previous, current) => previous - current);
  const median = extractedChannelValues[Math.floor(extractedChannelValues.length / 2) - 1];

  return median;
}

function splitOnAxisMedian(vbox: Vbox, axis: RGBIndex, median: number): [Vbox, Vbox] {
  const groupByAxisMedian = (color) => (color.channels[axis] <= median ? 0 : 1);
  const vboxes = vbox.reduce(
    (accumulator, color) => {
      accumulator[groupByAxisMedian(color)].push(color);
      return accumulator;
    },
    [[], []]
  );

  return vboxes;
}

function buildInverseColorMap(vboxes: Vbox[]): InverseColorMap {
  const inverseColorMap = vboxes.map((vbox) => {
    const representativeColor = findRepresentativeColor(vbox);
    return vbox.map((color) => ({
      sourceColor: color,
      representativeColor,
    }));
  });

  return [].concat(...inverseColorMap);
}

function buildColorPalette(vboxes: Vbox[]): ColorPalette {
  return vboxes.map((vbox) => ({
    color: findRepresentativeColor(vbox),
    population: vbox.length,
  }));
}

function findRepresentativeColor(vbox: Vbox): RGBColor {
  const colorSum = vbox.reduce(
    (accumulator, color) => [
      accumulator[RED_CHANNEL_INDEX] + color.red,
      accumulator[GREEN_CHANNEL_INDEX] + color.green,
      accumulator[BLUE_CHANNEL_INDEX] + color.blue,
    ],
    [0, 0, 0]
  );
  const colorAverage = colorSum.map((channelSum) => Math.floor(channelSum / vbox.length + 0.5));

  return new RGBColor([
    colorAverage[RED_CHANNEL_INDEX],
    colorAverage[GREEN_CHANNEL_INDEX],
    colorAverage[BLUE_CHANNEL_INDEX],
  ]);
}
