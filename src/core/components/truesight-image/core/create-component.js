// @flow

import truesight from 'truesight';

import ColorWheel from 'core/components/truesight-color-wheel';

import type { PopularityImageParameters } from '../types';
import loadImage from '../utils/load-image';

import '../style/truesight-image.scss';

export default async function createComponent(parameters: PopularityImageParameters): Promise<void> {
  const { imageElement } = parameters;

  await loadImage(imageElement, 5000);

  const colorWheel = new ColorWheel(imageElement);
  const colorPalette = await truesight.popularizeImage(parameters);

  colorWheel.draw('color-palette', { colorPalette });
}
