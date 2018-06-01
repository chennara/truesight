// @flow

export default function loadVideo(videoElement: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    const onVideoLoad = () => {
      resolve();
      videoElement.removeEventListener('loadeddata', onVideoLoad);
    };

    videoElement.addEventListener('loadeddata', onVideoLoad);

    if (videoElement.readyState === 4) {
      resolve();
      videoElement.removeEventListener('loadeddata', onVideoLoad);
    }
  });
}
