// @flow

import degreesToRadians from 'utils/math/degrees-to-radians';

import { calculateR } from '../core/calculate-dimensions';
import { BACKGROUND_COLOR } from '../style/colors';

export type DrawLoadingAnimationParameters = {|
  delta: number,
  completed: number,
|};

export default function drawLoadingAnimation(
  canvasElement: HTMLCanvasElement,
  parameters: DrawLoadingAnimationParameters
) {
  const { delta, completed } = parameters;

  const canvasContext = canvasElement.getContext('2d');

  canvasContext.save();

  canvasContext.translate(canvasElement.width / 2, canvasElement.height / 2);
  canvasContext.rotate(-Math.PI / 2);

  const r = calculateR(canvasElement.width);
  const endAngle = degreesToRadians(delta * completed * 360);

  canvasContext.beginPath();
  canvasContext.arc(0, 0, r, 0, endAngle);

  if (Math.abs(2 * Math.PI - endAngle) > 10 ** -3) {
    canvasContext.lineTo(0, 0);
    canvasContext.closePath();
  }

  canvasContext.fillStyle = BACKGROUND_COLOR;
  canvasContext.strokeStyle = BACKGROUND_COLOR;
  canvasContext.fill();
  canvasContext.stroke();

  canvasContext.restore();
}
