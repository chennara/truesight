// @flow

export default function drawFrameToCanvas(videoElement: HTMLVideoElement): HTMLCanvasElement {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = videoElement.width;
  canvasElement.height = videoElement.height;

  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);

  return canvasElement;
}
