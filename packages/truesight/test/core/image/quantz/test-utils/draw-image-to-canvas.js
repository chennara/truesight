export default function drawImageToCanvas(imageElement, canvasElement) {
  canvasElement.width = imageElement.width; // eslint-disable-line no-param-reassign
  canvasElement.height = imageElement.height; // eslint-disable-line no-param-reassign

  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

  return canvasElement;
}
