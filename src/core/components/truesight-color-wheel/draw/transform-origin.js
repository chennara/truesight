// @flow

import degreesToRadians from 'utils/math/degrees-to-radians';

import { DEFAULT_HUE_REGION_SIZE } from '../core/get-hue-regions';

export default function transformOrigin(canvasElement: HTMLCanvasElement) {
  const canvasContext = canvasElement.getContext('2d');

  const originCoordinates = [canvasElement.width / 2, canvasElement.height / 2];
  const rotationAngle = -Math.PI / 2 - degreesToRadians(DEFAULT_HUE_REGION_SIZE) / 2;

  canvasContext.translate(originCoordinates[0], originCoordinates[1]);
  canvasContext.rotate(rotationAngle);
}
