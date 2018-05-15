// @flow

import type { ImageElement } from './types/image-element';

export default async function getImageData(imageElement: ImageElement): Promise<Uint8ClampedArray> {
  if (imageElement instanceof HTMLImageElement) {
    return getImageDataFromHTMLImageElement(imageElement);
  }

  // imageElement is of type HTMLCanvasElement
  return getImageDataFromHTMLCanvasElement(imageElement);
}

function getImageDataFromHTMLImageElement(imageElement: HTMLImageElement): Promise<Uint8ClampedArray> {
  return new Promise((resolve) => {
    if (imageElement.complete && imageElement.naturalWidth !== 0) {
      const canvasElement = drawImageToHiddenCanvas(imageElement);
      resolve(getImageDataFromHTMLCanvasElement(canvasElement));
    } else {
      // eslint-disable-next-line no-param-reassign
      imageElement.onload = () => {
        const canvasElement = drawImageToHiddenCanvas(imageElement);
        resolve(getImageDataFromHTMLCanvasElement(canvasElement));
      };
    }
  });
}

function drawImageToHiddenCanvas(imageElement: HTMLImageElement): HTMLCanvasElement {
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
