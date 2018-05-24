import { VALID_FRAMES_PER_SECONDS, DEFAULT_FRAMES_PER_SECOND } from 'core/video/quantz/types';
import validateParameters from 'core/video/quantz/utils/validate-parameters';

describe('validating invalid video quantization parameters should return an error', () => {
  it('should return a RangeError if parameters does not include videoElement property', () => {
    const validatedParameters = validateParameters({});

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('parameters should include videoElement property');
  });

  it('should return a TypeError if videoElement is not of type HTMLVideoElementL', () => {
    const validatedParameters = validateParameters({
      videoElement: new Image(),
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('videoElement should be of type HTMLVideoElement');
  });

  it('should return a TypeError if framesPerSecond is not an integer', () => {
    const validatedParameters = validateParameters({
      videoElement: document.createElement('video'),
      framesPerSecond: () => 2,
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('framesPerSecond should be an integer');
  });

  it(`should return a RangeError if framesPerSecond does not lie in ${VALID_FRAMES_PER_SECONDS.toString()}`, () => {
    const validatedParameters = validateParameters({
      videoElement: document.createElement('video'),
      framesPerSecond: 25,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal(
      `framesPerSecond should lie in ${VALID_FRAMES_PER_SECONDS.toString()}`
    );
  });
});

describe('should provide the correct default values for video quantization', () => {
  it('should provide the default value for framesPerSecond if it was not provided', () => {
    const validatedParameters = validateParameters({
      videoElement: document.createElement('video'),
    });

    expect(validatedParameters).not.to.be.a('error');
    expect(validatedParameters).to.have.property('framesPerSecond', DEFAULT_FRAMES_PER_SECOND);
  });
});
