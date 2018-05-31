import popularizeVideo from 'core/quantz/video/popularity/popularize-video';

import createVideoElement from '../test-utils/create-video-element';
import collect from '../test-utils/async-collect';

describe('popularizeVideo should return an error if invalid video quantization parameters were provided', () => {
  it('should return a RangeError if parameters argument does not include videoElement property', async () => {
    let errorOccurred = false;

    try {
      const parsingResults = popularizeVideo({});
      await parsingResults.next();
    } catch (error) {
      errorOccurred = true;

      expect(error).to.be.an.instanceof(RangeError);
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});

describe('popularizeVideo should return a stream of parsing results', () => {
  it('should return a stream of parsing results', async function runTest() {
    this.timeout(10000);

    let errorOccurred = false;

    try {
      const parsingResults = popularizeVideo({
        videoElement: createVideoElement(436, 83, 'base/test/resources/videos/stars.mp4'),
        secondsBetweenFrames: 2.1,
      });
      await collect(parsingResults);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.false; // eslint-disable-line no-unused-expressions
  });
});
