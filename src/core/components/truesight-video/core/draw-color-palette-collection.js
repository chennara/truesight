// @flow

import ColorWheel from 'core/components/truesight-color-wheel';

import type { ColorPaletteCollection } from './popularize-video';

export default function drawColorPaletteCollection(
  colorWheel: ColorWheel,
  colorPaletteCollection: ColorPaletteCollection
) {
  const videoElement = colorWheel.mediaElement;

  if (videoElement instanceof HTMLVideoElement) {
    let nextFrameIndex = 0;
    let nextFrameTime = 0;

    const deltaTime = colorPaletteCollection[1].timestamp - colorPaletteCollection[0].timestamp;

    videoElement.addEventListener('timeupdate', () => {
      if (videoElement.currentTime >= nextFrameTime) {
        const mappedColorPalette = colorPaletteCollection.find((colorPalette) => colorPalette.index === nextFrameIndex);

        if (mappedColorPalette) {
          colorWheel.draw('color-palette', { colorPalette: mappedColorPalette.result });

          nextFrameIndex += 1;
          nextFrameTime += deltaTime;
        }
      }
    });

    videoElement.addEventListener('seeked', () => {
      nextFrameIndex = Math.floor(videoElement.currentTime / deltaTime) + 1;
      nextFrameTime = nextFrameIndex * deltaTime;
    });
  }
}
