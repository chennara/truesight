// @flow

import type { ImageElement } from 'core/image/types/image-element';

export default function getImageData(imageElement: ImageElement): Uint8ClampedArray {
  if (imageElement instanceof HTMLImageElement) {
    return getImageDataFromHTMLImageElement(imageElement);
  }

  // imageElement is of type HTMLCanvasElement
  return getImageDataFromHTMLCanvasElement(imageElement);
}

function getImageDataFromHTMLImageElement(imageElement: HTMLImageElement): Uint8ClampedArray {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = imageElement.width;
  canvasElement.height = imageElement.height;

  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

  return getImageDataFromHTMLCanvasElement(canvasElement);
}

function getImageDataFromHTMLCanvasElement(canvasElement: HTMLCanvasElement): Uint8ClampedArray {
  const canvasContext = canvasElement.getContext('2d');
  const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height).data;

  return imageData;
}
