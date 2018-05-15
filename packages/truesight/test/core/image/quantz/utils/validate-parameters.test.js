import { VALID_QUALITIES, DEFAULT_NUMBER_OF_COLORS, DEFAULT_QUALITY } from 'core/image/quantz/types';
import validateParameters from 'core/image/quantz/utils/validate-parameters';

import createRandomizedRGBImage from '../test-utils/create-randomized-rgb-image';

describe('should return an error if invalid quantization parameters were provided', () => {
  it('should return a RangeError if parameters does not include rgbImage nor imageElement property', () => {
    const validatedParameters = validateParameters({});

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('parameters should include either rgbImage or imageElement property');
  });

  it('should return a TypeError if image is not of type RGBImage', () => {
    const validatedParameters = validateParameters({
      rgbImage: [],
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('image should be of type RGBImage');
  });

  it('should return a TypeError if imageElement is not of type HTMLImageElement nor HTMLCanvasElement', () => {
    const validatedParameters = validateParameters({
      imageElement: "Maybe I'm wasting my young years",
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal(
      'imageElement should be of type HTMLImageElement or HTMLCanvasElement'
    );
  });

  it('should return a TypeError if numberOfColors is not an integer', () => {
    const validatedParameters = validateParameters({
      imageElement: new window.Image(),
      numberOfColors: 9.5,
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('numberOfColors should be an integer');
  });

  it('should return a RangeError if numberOfColors does not lie [1, 256]', () => {
    const validatedParameters = validateParameters({
      imageElement: new window.Image(),
      numberOfColors: 270,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('numberOfColors should lie in [1, 256]');
  });

  it('should return a TypeError if quality is not an integer', () => {
    const validatedParameters = validateParameters({
      imageElement: new window.Image(),
      quality: true,
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('quality should be an integer');
  });

  it(`should return a RangeError if quality does not lie in ${VALID_QUALITIES.toString()}`, () => {
    const validatedParameters = validateParameters({
      imageElement: new window.Image(),
      quality: 100,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal(`quality should lie in ${VALID_QUALITIES.toString()}`);
  });
});

describe('should provide the correct default values for color quantization', () => {
  const rgbImage = createRandomizedRGBImage(2 ** 10);

  it('should provide the default value for numberOfColors if it was not provided', () => {
    const validatedParameters = validateParameters({
      rgbImage,
    });

    expect(validatedParameters).not.to.be.a('error');
    expect(validatedParameters).to.have.property('numberOfColors', DEFAULT_NUMBER_OF_COLORS);
  });

  it('should provide the default value for quality if it was not provided', () => {
    const validatedParameters = validateParameters({
      rgbImage,
    });

    expect(validatedParameters).not.to.be.a('error');
    expect(validatedParameters).to.have.property('quality', DEFAULT_QUALITY);
  });
});
