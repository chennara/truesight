import { quantizeVideo, reduceVideo } from 'core/quantz/video/median-cut/quantize-video';

import createVideoElement from 'test-utils/video/create-video-element';
import errorify from 'test-utils/errorify';
import asyncCollect from 'test-utils/async-collect';

describe('median cut should return an error if invalid video quantization parameters were provided', () => {
  it('quantizeVideo should return a RangeError if width attribute in videoElement property is 0', () => {
    const parsingResultStream = quantizeVideo({
      videoElement: createVideoElement(0, 120, 'base/test/resources/videos/city.mp4'),
    });

    const result = errorify(parsingResultStream.next());

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
    });
  });

  it('reduceVideo should return a TypeError if secondsBetweenFrames property is not a number', () => {
    const parsingResultStream = quantizeVideo({
      videoElement: createVideoElement(40, 30, 'base/test/resources/videos/stars.mp4'),
      secondsBetweenFrames: 'four',
    });

    const result = errorify(parsingResultStream.next());

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
    });
  });
});

describe('median cut should return a stream of parsing results', () => {
  it('quantizeVideo should return a stream of parsing results', async function runTest() {
    this.timeout(10000);

    const parsingResultStream = quantizeVideo({
      videoElement: createVideoElement(31, 120, 'base/test/resources/videos/city.mp4'),
      quality: 3,
    });

    const result = asyncCollect(parsingResultStream);

    return result;
  });

  it('reduceVideo should return a stream of parsing results', async function runTest() {
    this.timeout(10000);

    const parsingResultStream = reduceVideo({
      videoElement: createVideoElement(40, 30, 'base/test/resources/videos/stars.mp4'),
      secondsBetweenFrames: 4,
    });

    const result = asyncCollect(parsingResultStream);

    return result;
  });
});
