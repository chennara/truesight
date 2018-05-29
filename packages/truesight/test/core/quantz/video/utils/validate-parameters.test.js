import { VALID_FRAMES_PER_SECONDS, DEFAULT_FRAMES_PER_SECOND } from 'core/quantz/video/types';
import validateParameters from 'core/quantz/video/utils/validate-parameters';

import createVideoElement from '../test-utils/create-video-element';

describe('validating invalid video quantization parameters should return an error', () => {
  it('should return a RangeError if parameters argument includes an unknown property', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(30, 40),
      fps: 4,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('parameters argument includes unknown property fps');
  });

  it('should return a RangeError if parameters argument does not include videoElement property', () => {
    const validatedParameters = validateParameters({});

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('parameters argument should include videoElement property');
  });

  it('should return a TypeError if videoElement property is not of type HTMLVideoElement', () => {
    const validatedParameters = validateParameters({
      videoElement: new Image(),
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('videoElement property should be of type HTMLVideoElement');
  });

  it('should return a RangeError if width attribute in videoElement property is 0', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(0, 40),
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('width attribute in videoElement property is 0');
  });

  it('should return a RangeError if height attribute in videoElement property is 0', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(30, 0),
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('height attribute in videoElement property is 0');
  });

  it('should return a TypeError if framesPerSecond property is not an integer', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(30, 40),
      framesPerSecond: () => 2,
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('framesPerSecond property should be an integer');
  });

  it(`should return a RangeError if framesPerSecond property does not lie in ${VALID_FRAMES_PER_SECONDS.toString()}`, () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(30, 40),
      framesPerSecond: 25,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal(
      `framesPerSecond property should lie in ${VALID_FRAMES_PER_SECONDS.toString()}`
    );
  });
});

describe('should provide the correct default values for video quantization', () => {
  it('should provide the default value for framesPerSecond property if it was not provided', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(30, 40),
    });

    expect(validatedParameters).not.to.be.a('error');
    expect(validatedParameters).to.have.property('framesPerSecond', DEFAULT_FRAMES_PER_SECOND);
  });
});
