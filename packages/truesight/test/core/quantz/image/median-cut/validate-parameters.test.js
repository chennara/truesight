import { RGBImage } from 'core/image/rgb-image';
import { VALID_QUALITIES, DEFAULT_NUMBER_OF_COLORS, DEFAULT_QUALITY } from 'core/quantz/image/types';
import validateParameters from 'core/quantz/image/median-cut/validate-parameters';

describe('validating invalid median cut parameters should return an error', () => {
  it('should return a RangeError if parameters argument includes an unknown property', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      numbetOfColors: 8,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('parameters argument includes unknown property numbetOfColors');
  });

  it('should return a RangeError if parameters argument includes both rgbImage and imageElement property', () => {
    const validatedParameters = validateParameters({
      rgbImage: new RGBImage(),
      imageElement: new Image(),
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('parameters argument includes unknown property rgbImage');
  });

  it('should return a RangeError if parameters argument does not include rgbImage nor imageElement property', () => {
    const validatedParameters = validateParameters({});

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal(
      'parameters argument should include either rgbImage or imageElement property'
    );
  });

  it('should return a TypeError if image property is not of type RGBImage', () => {
    const validatedParameters = validateParameters({
      rgbImage: [],
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('image property should be of type RGBImage');
  });

  it('should return a TypeError if imageElement property is not of type HTMLImageElement nor HTMLCanvasElement', () => {
    const validatedParameters = validateParameters({
      imageElement: "Maybe I'm wasting my young years",
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal(
      'imageElement property should be of type HTMLImageElement or HTMLCanvasElement'
    );
  });

  it('should return a TypeError if numberOfColors property is not an integer', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      numberOfColors: 9.5,
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('numberOfColors property should be an integer');
  });

  it('should return a RangeError if numberOfColors property does not lie in [1, 256]', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      numberOfColors: 270,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('numberOfColors property should lie in [1, 256]');
  });

  it('should return a TypeError if quality property is not an integer', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      quality: true,
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('quality property should be an integer');
  });

  it(`should return a RangeError if quality property does not lie in ${VALID_QUALITIES.toString()}`, () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      quality: 100,
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal(`quality property should lie in ${VALID_QUALITIES.toString()}`);
  });
});

describe('should provide the correct default values for the median cut algorithm', () => {
  const rgbImage = new RGBImage();

  it('should provide the default value for numberOfColors property if it was not provided', () => {
    const validatedParameters = validateParameters({
      rgbImage,
    });

    expect(validatedParameters).not.to.be.a('error');
    expect(validatedParameters).to.have.property('numberOfColors', DEFAULT_NUMBER_OF_COLORS);
  });

  it('should provide the default value for quality property if it was not provided', () => {
    const validatedParameters = validateParameters({
      rgbImage,
    });

    expect(validatedParameters).not.to.be.a('error');
    expect(validatedParameters).to.have.property('quality', DEFAULT_QUALITY);
  });
});
