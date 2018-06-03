import popularizeVideo from 'core/quantz/video/popularity/popularize-video';

import createVideoElement from 'test-utils/video/create-video-element';
import errorify from 'test-utils/errorify';
import asyncCollect from 'test-utils/async-collect';

describe('popularizeVideo should return an error if invalid video quantization parameters were provided', () => {
  it('should return a RangeError if parameters argument does not include videoElement property', () => {
    const parsingResultStream = popularizeVideo({});

    const result = errorify(parsingResultStream.next());

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
    });
  });
});

describe('popularizeVideo should return a stream of parsing results', () => {
  it('should return a stream of parsing results', async function runTest() {
    this.timeout(10000);

    const parsingResultStream = popularizeVideo({
      videoElement: createVideoElement(436, 83, 'base/test/resources/videos/stars.mp4'),
      secondsBetweenFrames: 2.1,
      numberOfColors: 5,
      quality: 4,
    });

    const result = asyncCollect(parsingResultStream);

    return result;
  });
});
