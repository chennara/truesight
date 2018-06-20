// @flow

import transformOrigin from './transform-origin';
import drawHueRegion from './draw-hue-region';

import getHueRegions from '../core/get-hue-regions';

export default function drawColorWheel(canvasElement: HTMLCanvasElement) {
  const canvasContext = canvasElement.getContext('2d');

  canvasContext.save();

  transformOrigin(canvasElement);

  for (const hueRegion of getHueRegions()) {
    const { hue, angleInterval } = hueRegion;

    const cssColor = `hsl(${hue}, 70%, 50%)`;
    const rInterval = [0, canvasElement.width];

    drawHueRegion(canvasElement, {
      cssColor,
      angleInterval,
      rInterval,
    });
  }

  canvasContext.restore();
}
