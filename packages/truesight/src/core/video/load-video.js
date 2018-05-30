// @flow

export default function loadVideo(videoElement: HTMLVideoElement): Promise<void> {
  return new Promise((resolve) => {
    if (videoElement.readyState === 4) {
      resolve();
    } else {
      const onVideoLoad = () => {
        resolve();
        videoElement.removeEventListener('loadeddata', onVideoLoad);
      };

      videoElement.addEventListener('loadeddata', onVideoLoad);
    }
  });
}
