// @flow
import type { VideoParsingParameters, ValidatedVideoParsingParameters } from 'core/quantz/video/types';
import { AsyncQueue } from 'utils/collections/async-queue';

import validateParameters from './validate-parameters';
import drawFrameToCanvas from './draw-frame-to-canvas';

// Function type that parses a given frame and returns a Promise holding the result.
export type ParseFrame<T> = (HTMLCanvasElement) => Promise<T>;

// An asynchronous generator object yielding parsing results for a given stream of video frames.
export type AsyncFrameResultGenerator<T> = AsyncGenerator<T, void, void>;

export default async function* parseVideo<T>(
  parameters: VideoParsingParameters,
  parseFrame: ParseFrame<T>
): AsyncFrameResultGenerator<T> {
  await loadVideo(parameters.videoElement);

  const validatedParameters = validateParameters(parameters);

  if (validatedParameters instanceof Error) {
    throw validatedParameters;
  }

  yield* parseFrames(validatedParameters, parseFrame);
}

function loadVideo(videoElement: HTMLVideoElement): Promise<void> {
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

async function* parseFrames<T>(
  parameters: ValidatedVideoParsingParameters,
  parseFrame: ParseFrame<T>
): AsyncFrameResultGenerator<T> {
  const frameResults = new AsyncQueue();

  const videoElement = parameters.videoElement.cloneNode();
  await loadVideo(videoElement);

  let currentTime = 0;
  videoElement.currentTime = currentTime;

  const parseNextFrame = async () => {
    const canvasElement = drawFrameToCanvas(videoElement);
    const frameResult = await parseFrame(canvasElement);
    frameResults.enqueue(frameResult);

    currentTime += parameters.secondsBetweenFrames;

    if (currentTime <= videoElement.duration) {
      videoElement.currentTime = currentTime;
    } else {
      frameResults.close();
      videoElement.removeEventListener('seeked', parseNextFrame);
    }
  };

  videoElement.addEventListener('seeked', parseNextFrame);

  yield* getNextFrameResult(frameResults);
}

async function* getNextFrameResult<T>(frameResults: AsyncQueue<T>): AsyncFrameResultGenerator<T> {
  const frameResult = await frameResults.next();

  if (!frameResult.done) {
    yield frameResult.value;
    yield* getNextFrameResult(frameResults);
  }
}
