// @flow

import truesightImage from './core/components/truesight-image';
import truesightVideo from './core/components/truesight-video';

const imageElements = document.querySelectorAll('.truesight-image > img');

imageElements.forEach(async (imageElement) => {
  if (imageElement instanceof HTMLImageElement) {
    await truesightImage.create({
      imageElement,
      numberOfColors: 12,
      quality: 10,
    });
  }
});

const videoElements = document.querySelectorAll('.truesight-video > video');

videoElements.forEach(async (videoElement) => {
  if (videoElement instanceof HTMLVideoElement) {
    await truesightVideo.create({
      videoElement,
      secondsBetweenFrames: 1,
      numberOfColors: 8,
      quality: 10,
    });
  }
});
