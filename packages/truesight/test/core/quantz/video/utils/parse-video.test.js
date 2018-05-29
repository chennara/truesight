import parseVideo from 'core/quantz/video/utils/parse-video';

import createVideoElement from '../test-utils/create-video-element';

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

      const frameResults = parseVideo(testSuite.videoParsingParameters, parseFrame);
      await collect(frameResults);

      const { videoElement, secondsBetweenFrames } = testSuite.videoParsingParameters;
      const expectedCallCount = Math.floor(videoElement.duration / secondsBetweenFrames) + 1;
      expect(parseFrame.callCount).to.equal(expectedCallCount);
    });
  }
}

async function collect(iterable) {
  const result = [];

  for await (const element of iterable) {
    result.push(element);
  }

  return result;
}

describe('parseVideo should return an error if invalid parsing parameters were provided', () => {
  it('should return a RangeError if secondsBetweenFrames is 0', async () => {
    const videoParsingParameters = {
      videoElement: createVideoElement(90, 90, 'base/test/resources/videos/city.mp4'),
      secondsBetweenFrames: 0,
    };

    const frameResults = parseVideo(videoParsingParameters, sinon.fake());

    let errorOccurred = false;

    try {
      await frameResults.next();
    } catch (error) {
      expect(error).to.be.an.instanceof(RangeError);
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
