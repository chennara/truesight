export default function drawImageToCanvas(imageElement, canvasElement) {
  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
}
