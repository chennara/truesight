import parseVideo from 'core/quantz/video/utils/parse-video';

import createVideoElement from '../test-utils/create-video-element';
import collect from '../test-utils/async-collect';

describe('parseVideo should parse the correct number of frames', () => {
  const testSuites = [
    {
      name: 'should parse the correct number of frames if secondsBetweenFrames is 1',
      videoParsingParameters: {
        videoElement: createVideoElement(80, 40, 'base/test/resources/videos/city.mp4'),
        secondsBetweenFrames: 1,
      },
    },
    {
      name: 'should parse the correct number of frames if secondsBetweenFrames is 0.7',
      videoParsingParameters: {
        videoElement: createVideoElement(120, 47, 'base/test/resources/videos/city.mp4'),
        secondsBetweenFrames: 0.7,
      },
    },
    {
      name: 'should parse the correct number of frames if secondsBetweenFrames is 2.4',
      videoParsingParameters: {
        videoElement: createVideoElement(19, 400, 'base/test/resources/videos/stars.mp4'),
        secondsBetweenFrames: 2.4,
      },
    },
  ];

  runExpectedCallCountTests(testSuites);
});

function runExpectedCallCountTests(testSuites) {
  for (const testSuite of testSuites) {
    it(testSuite.name, async function runTest() {
      this.timeout(10000);

      const parseFrame = sinon.stub();
      parseFrame.resolves(42);

      const parsingResults = parseVideo(testSuite.videoParsingParameters, parseFrame);
      await collect(parsingResults);

      const { videoElement, secondsBetweenFrames } = testSuite.videoParsingParameters;
      const expectedCallCount = Math.floor(videoElement.duration / secondsBetweenFrames) + 1;

      expect(parseFrame.callCount).to.equal(expectedCallCount);
    });
  }
}

describe('parseVideo should return an error if invalid parameters were provided', () => {
  it('should return a RangeError if secondsBetweenFrames is not greater than 0', async () => {
    const videoParsingParameters = {
      videoElement: createVideoElement(90, 90, 'base/test/resources/videos/city.mp4'),
      secondsBetweenFrames: 0,
    };

    let errorOccurred = false;

    try {
      const parsingResults = parseVideo(videoParsingParameters, sinon.fake());
      await parsingResults.next();
    } catch (error) {
      errorOccurred = true;

      expect(error).to.be.an.instanceof(RangeError);
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
