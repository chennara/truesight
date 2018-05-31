import { quantizeVideo, reduceVideo } from 'core/quantz/video/median-cut/quantize-video';

import createVideoElement from '../test-utils/create-video-element';
import collect from '../test-utils/async-collect';

describe('median cut should return an error if invalid video quantization parameters were provided', () => {
  it('quantizeVideo should return a RangeError if width attribute in videoElement property is 0', async () => {
    let errorOccurred = false;

    try {
      const parsingResults = quantizeVideo({
        videoElement: createVideoElement(0, 120, 'base/test/resources/videos/city.mp4'),
      });
      await parsingResults.next();
    } catch (error) {
      errorOccurred = true;

      expect(error).to.be.an.instanceof(RangeError);
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('reduceVideo should return a TypeError if secondsBetweenFrames property is not a number', async () => {
    let errorOccurred = false;

    try {
      const parsingResults = reduceVideo({
        videoElement: createVideoElement(40, 30, 'base/test/resources/videos/stars.mp4'),
        secondsBetweenFrames: 'four',
      });
      await parsingResults.next();
    } catch (error) {
      errorOccurred = true;

      expect(error).to.be.an.instanceof(TypeError);
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});

describe('median cut should return a stream of parsing results', () => {
  it('quantizeVideo should return a stream of parsing results', async function runTest() {
    this.timeout(10000);

    let errorOccurred = false;

    try {
      const parsingResults = quantizeVideo({
        videoElement: createVideoElement(31, 120, 'base/test/resources/videos/city.mp4'),
      });
      await collect(parsingResults);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.false; // eslint-disable-line no-unused-expressions
  });

  it('reduceVideo should return a stream of parsing results', async function runTest() {
    this.timeout(10000);

    let errorOccurred = false;

    try {
      const parsingResults = reduceVideo({
        videoElement: createVideoElement(40, 30, 'base/test/resources/videos/stars.mp4'),
        secondsBetweenFrames: 4,
      });
      await collect(parsingResults);
    } catch (error) {
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.false; // eslint-disable-line no-unused-expressions
  });
});
