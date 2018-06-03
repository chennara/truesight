export default function createVideoElement(width, height, src = '') {
  const videoElement = document.createElement('video');
  videoElement.src = src;
  videoElement.width = width;
  videoElement.height = height;

  return videoElement;
}
