import { DEFAULT_SECONDS_BETWEEN_FRAMES } from 'core/quantz/video/types';
import validateParameters from 'core/quantz/video/utils/validate-parameters';

import createVideoElement from '../test-utils/create-video-element';

describe('validating invalid video quantization parameters should return an error', () => {
  it('should return a RangeError if parameters argument includes an unknown property', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(40, 30),
      framesPerSecond: 4,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('parameters argument includes unknown property framesPerSecond');
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
      videoElement: createVideoElement(0, 30),
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('width attribute in videoElement property is 0');
  });

  it('should return a RangeError if height attribute in videoElement property is 0', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(40, 0),
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('height attribute in videoElement property is 0');
  });

  it('should return a TypeError if secondsBetweenFrames property is not a number', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(40, 30),
      secondsBetweenFrames: () => 2,
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('secondsBetweenFrames property should be a number');
  });

  it('should return a RangeError if secondsBetweenFrames is not greater than 0', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(40, 30),
      secondsBetweenFrames: -11,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('secondsBetweenFrames property should be greater than 0');
  });
});

describe('should provide the correct default values for video quantization', () => {
  it('should provide the default value for secondsBetweenFrames property if it was not provided', () => {
    const validatedParameters = validateParameters({
      videoElement: createVideoElement(40, 30),
    });

    expect(validatedParameters).not.to.be.a('error');
    expect(validatedParameters).to.have.property('secondsBetweenFrames', DEFAULT_SECONDS_BETWEEN_FRAMES);
  });
});
