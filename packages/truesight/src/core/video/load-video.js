// @flow

export default function loadVideo(videoElement: HTMLVideoElement, delay: number = 2000): Promise<void> {
  const loadVideoPromise = new Promise((resolve) => {
    const onVideoLoad = () => {
      videoElement.removeEventListener('loadeddata', onVideoLoad);
      resolve();
    };

    videoElement.addEventListener('loadeddata', onVideoLoad);

    if (videoElement.readyState === 4) {
      videoElement.removeEventListener('loadeddata', onVideoLoad);
      resolve();
    }
  });

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new RangeError(`failed to load the video, timeout of ${delay} ms exceeded`));
    }, delay);
  });

  return Promise.race([loadVideoPromise, timeoutPromise]);
}
