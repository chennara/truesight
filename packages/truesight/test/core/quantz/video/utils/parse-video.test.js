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
    {
      name: 'should only parse the first frame if secondsBetweenFrames is greater than the video length',
      videoParsingParameters: {
        videoElement: createVideoElement(568, 502, 'base/test/resources/videos/stars.mp4'),
        secondsBetweenFrames: 6.1,
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

      const parsingResultStream = parseVideo(testSuite.videoParsingParameters, parseFrame);
      await collect(parsingResultStream);

      const { videoElement, secondsBetweenFrames } = testSuite.videoParsingParameters;
      const expectedCallCount = Math.floor(videoElement.duration / secondsBetweenFrames) + 1;

      expect(parseFrame.callCount).to.equal(expectedCallCount);
    });
  }
}

describe('parseVideo should return a stream of parsing results', () => {
  it('should return a stream of parsing results', async function runTest() {
    this.timeout(10000);

    const videoParsingParameters = {
      videoElement: createVideoElement(54, 70, 'base/test/resources/videos/stars.mp4'),
      secondsBetweenFrames: 1.64,
    };

    const parseFrame = sinon.stub();
    parseFrame.onCall(0).resolves(42);
    parseFrame.onCall(1).resolves(14);
    parseFrame.onCall(2).resolves(17);
    parseFrame.onCall(3).resolves(956);

    const parsingResultStream = parseVideo(videoParsingParameters, parseFrame);
    const parsingResults = await collect(parsingResultStream);

    expect(parsingResults).to.deep.equal([
      { index: 1, timestamp: 0, result: 42 },
      { index: 2, timestamp: 1.64, result: 14 },
      { index: 3, timestamp: 3.28, result: 17 },
      { index: 4, timestamp: 4.92, result: 956 },
    ]);
  });

  it('should close the stream when an error is thrown', async function runTest() {
    this.timeout(10000);

    const videoParsingParameters = {
      videoElement: createVideoElement(54, 70, 'base/test/resources/videos/city.mp4'),
      secondsBetweenFrames: 3.9,
    };

    const parseFrame = sinon.stub();
    parseFrame.onCall(0).resolves(3);
    parseFrame.onCall(1).resolves(-73);
    parseFrame.onCall(2).rejects();
    parseFrame.onCall(3).resolves(24);

    const parsingResultStream = parseVideo(videoParsingParameters, parseFrame);
    const parsingResults = await collect(parsingResultStream);

    expect(parsingResults).to.deep.equal([
      { index: 1, timestamp: 0, result: 3 },
      { index: 2, timestamp: 3.9, result: -73 },
    ]);
  });
});

describe('parseVideo should return an error if invalid parameters were provided', () => {
  it('should return a RangeError if secondsBetweenFrames is not greater than 0', async () => {
    const videoParsingParameters = {
      videoElement: createVideoElement(90, 90, 'base/test/resources/videos/city.mp4'),
      secondsBetweenFrames: 0,
    };

    let errorOccurred = false;

    try {
      const parsingResultStream = parseVideo(videoParsingParameters, sinon.fake());
      await parsingResultStream.next();
    } catch (error) {
      errorOccurred = true;

      expect(error).to.be.an.instanceof(RangeError);
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
