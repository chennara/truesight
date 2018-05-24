// @flow

import type { VideoQuantizationParameters } from 'core/video/quantz/types';
import { AsyncQueue } from 'utils/collections/async-queue';

import validateParameters from './validate-parameters';
import drawFrameToCanvas from './draw-frame-to-canvas';

// Function type that parses a given frame and returns a Promise holding the result.
export type ParseFrame<T> = (any) => Promise<T>;

// An asynchronous generator object yielding color maps for a given stream of video frames.
export type AsyncColorMapGenerator<T> = AsyncGenerator<T, void, void>;

export default async function* parseVideo<T>(
  parseFrame: ParseFrame<T>,
  parameters: VideoQuantizationParameters
): AsyncColorMapGenerator<T> {
  const validatedParameters = validateParameters(parameters);

  if (validatedParameters instanceof Error) {
    throw validatedParameters;
  }

  yield* parseFrames(parseFrame, parameters);
}

async function* parseFrames<T>(
  parseFrame: ParseFrame<T>,
  parameters: VideoQuantizationParameters
): AsyncColorMapGenerator<T> {
  const videoElement = parameters.videoElement.cloneNode();
  const { framesPerSecond, numberOfColors, quality } = parameters;

  const colorMaps = new AsyncQueue();
  let currentTime = 0;

  const parseNextFrame = async () => {
    const canvasElement = drawFrameToCanvas(videoElement);

    const colorMap = await parseFrame({
      imageElement: canvasElement,
      numberOfColors,
      quality,
    });

    colorMaps.enqueue(colorMap);

    currentTime += 1 / framesPerSecond;

    if (currentTime <= videoElement.duration) {
      videoElement.currentTime = currentTime;
    } else {
      colorMaps.close();
      videoElement.removeEventListener('seeked', parseNextFrame);
    }
  };

  videoElement.addEventListener('seeked', parseNextFrame);

  if (videoElement.readyState === 4) {
    videoElement.currentTime = 0;
  } else {
    const playVideo = () => {
      videoElement.currentTime = 0;
      videoElement.removeEventListener('loadeddata', playVideo);
    };

    videoElement.addEventListener('loadeddata', playVideo);
  }

  yield* getNextFrameResult(colorMaps);
}

async function* getNextFrameResult<T>(colorMaps: AsyncQueue<T>): AsyncColorMapGenerator<T> {
  const frameResult = await colorMaps.next();

  if (!frameResult.done) {
    yield frameResult.value;
    yield* getNextFrameResult(colorMaps);
  }
}
