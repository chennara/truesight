// @flow
import { AsyncQueue } from 'utils/collections/async-queue';
import loadVideo from 'core/video/load-video';

import type { VideoParsingParameters, ValidatedVideoParsingParameters } from '../types';

import validateParameters from './validate-parameters';

// Function type that parses a given frame and returns a Promise holding the result.
export type ParseFrame<T> = (HTMLCanvasElement) => Promise<T>;

// An asynchronous generator object yielding parsing results for a given stream of video frames.
export type AsyncFrameResultGenerator<T> = AsyncGenerator<T, void, void>;

export default async function* parseVideo<T>(
  parameters: VideoParsingParameters,
  parseFrame: ParseFrame<T>
): AsyncFrameResultGenerator<T> {
  const validatedParameters = validateParameters(parameters);

  if (validatedParameters instanceof Error) {
    throw validatedParameters;
  }

  yield* parseFrames(validatedParameters, parseFrame);
}

async function* parseFrames<T>(
  parameters: ValidatedVideoParsingParameters,
  parseFrame: ParseFrame<T>
): AsyncFrameResultGenerator<T> {
  const parsingResults = new AsyncQueue();

  const videoElement = parameters.videoElement.cloneNode();

  videoElement.preload = 'auto';
  await loadVideo(videoElement);

  let currentTime = 0;
  videoElement.currentTime = currentTime;

  const parseNextFrame = async () => {
    const canvasElement = drawFrameToCanvas(videoElement);
    const parsingResult = await parseFrame(canvasElement);
    parsingResults.enqueue(parsingResult);

    currentTime += parameters.secondsBetweenFrames;

    if (currentTime <= videoElement.duration) {
      videoElement.currentTime = currentTime;
    } else {
      parsingResults.close();
      videoElement.removeEventListener('seeked', parseNextFrame);
    }
  };

  await parseNextFrame();

  videoElement.addEventListener('seeked', parseNextFrame);

  yield* getNextParsingResult(parsingResults);
}

function drawFrameToCanvas(videoElement: HTMLVideoElement): HTMLCanvasElement {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = videoElement.width;
  canvasElement.height = videoElement.height;

  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);

  return canvasElement;
}

async function* getNextParsingResult<T>(parsingResults: AsyncQueue<T>): AsyncFrameResultGenerator<T> {
  const parsingResult = await parsingResults.next();

  if (!parsingResult.done) {
    yield parsingResult.value;
    yield* getNextParsingResult(parsingResults);
  }
}
