import { DEFAULT_SECONDS_BETWEEN_FRAMES } from 'core/quantz/video/types';
import validateParameters from 'core/quantz/video/utils/validate-parameters';

import createVideoElement from 'test-utils/video/create-video-element';
import errorify from 'test-utils/errorify';

describe('validating invalid video quantization parameters should return an error', () => {
  it('should return a RangeError if video could not be loaded', function runTest() {
    this.timeout(5000);

    const result = errorify(
      validateParameters({
        videoElement: createVideoElement(40, 30, 'base/test/resources/videos/turnable.mp4'),
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('failed to load the video, timeout of 2000 ms exceeded');
    });
  });

  it('should return a RangeError if parameters argument includes an unknown property', () => {
    const result = errorify(
      validateParameters({
        videoElement: createVideoElement(40, 30, 'base/test/resources/videos/city.mp4'),
        framesPerSecond: 4,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('parameters argument includes unknown property framesPerSecond');
    });
  });

  it('should return a RangeError if parameters argument does not include videoElement property', () => {
    const result = errorify(validateParameters({}));

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('parameters argument should include videoElement property');
    });
  });

  it('should return a TypeError if videoElement property is not of type HTMLVideoElement', () => {
    const result = errorify(
      validateParameters({
        videoElement: new Image(),
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('videoElement property should be of type HTMLVideoElement');
    });
  });

  it('should return a RangeError if width attribute in videoElement property is 0', () => {
    const result = errorify(
      validateParameters({
        videoElement: createVideoElement(0, 30, 'base/test/resources/videos/city.mp4'),
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('width attribute in videoElement property is 0');
    });
  });

  it('should return a RangeError if height attribute in videoElement property is 0', () => {
    const result = errorify(
      validateParameters({
        videoElement: createVideoElement(40, 0, 'base/test/resources/videos/city.mp4'),
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('height attribute in videoElement property is 0');
    });
  });

  it('should return a TypeError if secondsBetweenFrames property is not a number', () => {
    const result = errorify(
      validateParameters({
        videoElement: createVideoElement(40, 30, 'base/test/resources/videos/city.mp4'),
        secondsBetweenFrames: () => 2,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('secondsBetweenFrames property should be a number');
    });
  });

  it('should return a RangeError if secondsBetweenFrames is not greater than 0', () => {
    const result = errorify(
      validateParameters({
        videoElement: createVideoElement(40, 30, 'base/test/resources/videos/city.mp4'),
        secondsBetweenFrames: -11,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('secondsBetweenFrames property should be greater than 0');
    });
  });
});

describe('should provide the correct default values for video quantization', () => {
  it('should provide the default value for secondsBetweenFrames property if it was not provided', () => {
    const result = validateParameters({
      videoElement: createVideoElement(40, 30, 'base/test/resources/videos/city.mp4'),
    });

    return result.then((validatedParameters) => {
      expect(validatedParameters).to.have.property('secondsBetweenFrames', DEFAULT_SECONDS_BETWEEN_FRAMES);
    });
  });
});
