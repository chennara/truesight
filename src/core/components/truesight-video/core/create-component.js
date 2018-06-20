// @flow

import ColorWheel from 'core/components/truesight-color-wheel';

import setDimensions from './set-dimensions';
import popularizeVideo from './popularize-video';
import drawColorPaletteCollection from './draw-color-palette-collection';

import type { PopularityVideoParameters } from '../types';
import loadVideo from '../utils/load-video';

import '../style/truesight-video.scss';

export default async function createComponent(parameters: PopularityVideoParameters): Promise<void> {
  const { videoElement } = parameters;

  await loadVideo(videoElement, 5000);
  await setDimensions(videoElement);

  const colorWheel = new ColorWheel(videoElement);
  const colorPaletteCollection = await popularizeVideo(parameters, colorWheel);

  drawColorPaletteCollection(colorWheel, colorPaletteCollection);
}
