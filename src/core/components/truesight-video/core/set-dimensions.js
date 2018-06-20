// @flow

const ASPECT_RATIO_VIDEO = 1280 / 536;

export default async function setDimensions(videoElement: HTMLVideoElement): Promise<void> {
  const containerElement = document.querySelector('.container');

  if (containerElement) {
    videoElement.width = containerElement.offsetWidth; // eslint-disable-line no-param-reassign
    videoElement.height = videoElement.width / ASPECT_RATIO_VIDEO; // eslint-disable-line no-param-reassign
  }
}
