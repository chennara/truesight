// @flow

import type { Try } from 'utils/fp/neither';
import { HSLuvImage } from 'core/image/types/hsluv-image';
import { HSLuvColor } from 'core/color/hsluv-color';
import { RGBColor } from 'core/color/rgb-color';

import type { PopularityParameters, ValidatedPopularityParameters, RegionSize } from './types';
import validateParameters from './validate-parameters';
import mapColorToRegionID from './map-color-to-region-id';

// A histogram of the most dominant colors in a image.
export type ColorPalette = ColorToPopulationMap[];

// Maps a color to the number of pixels with that specific color.
type ColorToPopulationMap = {|
  color: RGBColor,
  population: number,
|};

// Maps each region to its color histogram.
type ImageHistogram = [string, RegionHistogram][];

// Maps a color to the number of pixels with that specific color within a specific region.
type RegionHistogram = [string, number][];

export default function popularize(parameters: PopularityParameters): Try<ColorPalette> {
  const validatedParameters = validateParameters(parameters);
  if (validatedParameters instanceof Error) {
    return validatedParameters;
  }

  const hsluvImage = extractHSLuvImage(validatedParameters);
  const colorPalette = buildColorPalette(
    hsluvImage,
    validatedParameters.regionSize,
    validatedParameters.numberOfColors
  );

  return colorPalette;
}

function extractHSLuvImage(parameters: ValidatedPopularityParameters): HSLuvImage {
  return parameters.rgbImage
    ? HSLuvImage.fromRGBImage(parameters.rgbImage, parameters.quality)
    : HSLuvImage.fromImageElement(parameters.imageElement, parameters.quality);
}

function buildColorPalette(image: HSLuvImage, regionSize: RegionSize, numberOfColors: number): ColorPalette {
  const histogram = buildHistogram(image, regionSize);
  const colorPalette = findMostDominantColors(histogram, numberOfColors);

  return colorPalette;
}

function buildHistogram(image: HSLuvImage, regionSize: RegionSize): ImageHistogram {
  const histogram = new Map();

  image.data.forEach((color) => {
    const regionID = mapColorToRegionID(color, regionSize);
    const colorID = color.toString();
    const regionHistogram = histogram.get(regionID);

    if (!regionHistogram) {
      histogram.set(regionID, new Map([[colorID, 1]]));
    } else {
      const colorPopulation = regionHistogram.get(colorID);
      if (!colorPopulation) {
        regionHistogram.set(colorID, 1);
      } else {
        regionHistogram.set(colorID, colorPopulation + 1);
      }
    }
  });

  return Array.from(histogram.entries()).map((region) => [
    region[0],
    Array.from(region[1].entries()).map((color) => [color[0], color[1]]),
  ]);
}

function findMostDominantColors(histogram: ImageHistogram, numberOfColors: number): ColorPalette {
  const mostDominantRegions = findMostDominantRegions(histogram, numberOfColors);
  const mostDominantColors = mostDominantRegions.map((region) => findMostDominantColor(region[1]));

  return mostDominantColors;
}

function findMostDominantRegions(histogram: ImageHistogram, numberOfColors: number): ImageHistogram {
  const regions = histogram.map((region) => ({
    regionID: region[0],
    population: getRegionPopulation(region[1]),
  }));
  regions.sort((previous, current) => current.population - previous.population);

  const mostDominantRegionIDs = regions.slice(0, numberOfColors).map((region) => region.regionID);
  const mostDominantRegions = histogram.filter((region) => mostDominantRegionIDs.includes(region[0]));

  return mostDominantRegions;
}

function findMostDominantColor(histogram: RegionHistogram): ColorToPopulationMap {
  const mostDominantColorEntry = histogram
    .map((color) => ({
      color: HSLuvColor.fromString(color[0]),
      population: color[1],
    }))
    .reduce((previous, current) => (current.population > previous.population ? current : previous));

  return {
    color: mostDominantColorEntry.color.toRGBColor(),
    population: getRegionPopulation(histogram),
  };
}

function getRegionPopulation(histogram: RegionHistogram): number {
  return histogram.reduce((accumulator, color) => accumulator + color[1], 0);
}
