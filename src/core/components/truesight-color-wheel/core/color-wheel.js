// @flow

import type { DrawMethod } from '../draw/color-wheel-canvas';
import ColorWheelCanvas from '../draw/color-wheel-canvas';

import '../style/truesight-color-wheel.scss';

export default class ColorWheel {
  canvas: ColorWheelCanvas;
  mediaElement: HTMLImageElement | HTMLVideoElement;

  constructor(mediaElement: HTMLImageElement | HTMLVideoElement) {
    const canvasElement = document.createElement('canvas');
    canvasElement.className = 'truesight-color-wheel';
    canvasElement.style.top = '10px';
    canvasElement.style.right = '10px';

    const { parentNode } = mediaElement;
    if (parentNode) {
      parentNode.appendChild(canvasElement);
    }

    this.canvas = new ColorWheelCanvas(canvasElement);
    this.mediaElement = mediaElement;

    this.resizeCanvasElement();
    this.addResizeEventListeners();
  }

  resizeCanvasElement() {
    const currentWidth = this.mediaElement.offsetWidth;
    const r1 = 1090 - 285;
    const r2 = 125 - 50;
    const resizedWidth = r2 * (currentWidth - 285) / r1 + 50;

    this.canvas.resize(resizedWidth);
  }

  addResizeEventListeners() {
    window.addEventListener('resize', () => {
      this.resizeCanvasElement();
      this.canvas.redrawLastFrame();
    });
  }

  draw(method: DrawMethod, parameters: any) {
    this.canvas.draw(method, parameters);
  }

  redrawLastFrame() {
    this.canvas.redrawLastFrame();
  }
}
