// @flow

import { calculateR } from '../core/calculate-dimensions';
import { BACKGROUND_COLOR } from '../style/colors';

export default function drawBackground(canvasElement: HTMLCanvasElement) {
  const canvasContext = canvasElement.getContext('2d');

  canvasContext.save();

  canvasContext.translate(canvasElement.width / 2, canvasElement.height / 2);

  const r = calculateR(canvasElement.width);
  const endAngle = 2 * Math.PI;

  canvasContext.beginPath();
  canvasContext.arc(0, 0, r, 0, endAngle);

  canvasContext.fillStyle = BACKGROUND_COLOR;
  canvasContext.fill();

  canvasContext.restore();
}
