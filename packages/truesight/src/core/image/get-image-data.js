// @flow

import type { ImageElement } from './image-element';

export default async function getImageData(imageElement: ImageElement): Promise<Uint8ClampedArray> {
  if (imageElement instanceof HTMLImageElement) {
    return getImageDataFromHTMLImageElement(imageElement);
  }

  // imageElement is of type HTMLCanvasElement
  return getImageDataFromHTMLCanvasElement(imageElement);
}

function getImageDataFromHTMLImageElement(imageElement: HTMLImageElement): Promise<Uint8ClampedArray> {
  return new Promise((resolve) => {
    if (imageElement.complete) {
      const canvasElement = drawImageToCanvas(imageElement);
      resolve(getImageDataFromHTMLCanvasElement(canvasElement));
    } else {
      const onImageLoad = () => {
        const canvasElement = drawImageToCanvas(imageElement);
        resolve(getImageDataFromHTMLCanvasElement(canvasElement));
        imageElement.removeEventListener('load', onImageLoad);
      };

      imageElement.addEventListener('load', onImageLoad);
    }
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
