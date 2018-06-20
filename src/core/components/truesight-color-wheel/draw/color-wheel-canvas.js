// @flow

import drawLoadingAnimation from '../draw/draw-loading-animation';
import drawColorWheel from '../draw/draw-color-wheel';
import drawColorPalette from '../draw/draw-color-palette';

export default class ColorWheelCanvas {
  canvasElement: HTMLCanvasElement;
  lastRequest: [DrawMethod, any];

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvasElement = canvasElement;
  }

  draw(method: DrawMethod, parameters: any) {
    this.clearCanvas();
    routeRequest(method, this.canvasElement, parameters);
    this.lastRequest = [method, parameters];
  }

  clearCanvas() {
    const canvasContext = this.canvasElement.getContext('2d');
    canvasContext.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  redrawLastFrame() {
    if (this.lastRequest) {
      const [method, parameters] = this.lastRequest;
      this.draw(method, parameters);
    }
  }

  resize(width: number) {
    this.canvasElement.width = width;
    this.canvasElement.height = width;
  }
}

export type DrawMethod = 'loading-animation' | 'color-wheel' | 'color-palette';

function routeRequest(method: DrawMethod, canvasElement: HTMLCanvasElement, parameters: any) {
  switch (method) {
    case 'loading-animation':
      drawLoadingAnimation(canvasElement, parameters);
      break;
    case 'color-wheel':
      drawColorWheel(canvasElement);
      break;
    case 'color-palette':
      drawColorPalette(canvasElement, parameters);
      break;
    default:
      break;
  }
}
