// @flow

import { calculateR } from '../core/calculate-dimensions';

export type DrawHueRegionParameters = {|
  cssColor: string,
  angleInterval: [number, number],
  rInterval: [number, number],
|};

export default function drawHueRegion(canvasElement: HTMLCanvasElement, parameters: DrawHueRegionParameters) {
  const { cssColor, angleInterval, rInterval } = parameters;

  const [startAngle, endAngle] = angleInterval;
  const [startR, endR] = rInterval;

  const canvasContext = canvasElement.getContext('2d');

  canvasContext.save();

  for (let i = startR; i <= endR; i += 1) {
    const r = calculateR(i);

    canvasContext.beginPath();
    canvasContext.arc(0, 0, r, startAngle, endAngle);

    canvasContext.strokeStyle = cssColor;
    canvasContext.stroke();
  }

  canvasContext.restore();
}
