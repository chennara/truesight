// @flow

import { asyncTry } from 'utils/fp/try';

import type { ImageElement } from './image-element';
import loadImage from './load-image';

export default async function getImageData(imageElement: ImageElement): Promise<Uint8ClampedArray> {
  if (imageElement instanceof HTMLImageElement) {
    return getImageDataFromHTMLImageElement(imageElement);
  }

  // imageElement is of type HTMLCanvasElement
  return getImageDataFromHTMLCanvasElement(imageElement);
}

async function getImageDataFromHTMLImageElement(imageElement: HTMLImageElement): Promise<Uint8ClampedArray> {
  return asyncTry(async () => {
    await loadImage(imageElement);

    const canvasElement = drawImageToCanvas(imageElement);
    const imageData = getImageDataFromHTMLCanvasElement(canvasElement);

    return imageData;
  });
}

function drawImageToCanvas(imageElement: HTMLImageElement): HTMLCanvasElement {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = imageElement.width;
  canvasElement.height = imageElement.height;

  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

  return canvasElement;
}

function getImageDataFromHTMLCanvasElement(canvasElement: HTMLCanvasElement): Uint8ClampedArray {
  const canvasContext = canvasElement.getContext('2d');
  const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height).data;

  return imageData;
}
