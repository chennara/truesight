// @flow

import truesight from 'truesight';

import type { ColorPalette } from 'core/types/color-palette';
import ColorWheel from 'core/components/truesight-color-wheel';

import type { PopularityVideoParameters, ParsingResultCollection } from '../types';

export type ColorPaletteCollection = ParsingResultCollection<ColorPalette>;

export default async function popularizeVideo(
  parameters: PopularityVideoParameters,
  colorWheel: ColorWheel
): Promise<ColorPaletteCollection> {
  const { videoElement, secondsBetweenFrames } = parameters;

  const colorPaletteCollection = [];

  const colorPaletteStream = truesight.popularizeVideo(parameters);

  const expectedNumberOfFrames = Math.floor(videoElement.duration / secondsBetweenFrames) + 1;
  const delta = 1 / expectedNumberOfFrames;
  let completed = 0;

  for await (const colorPalette of colorPaletteStream) {
    completed += 1;

    colorWheel.draw('loading-animation', { delta, completed });

    colorPaletteCollection.push(colorPalette);
  }

  return colorPaletteCollection;
}
