import { DEFAULT_REGION_SIZE } from 'core/image/quantz/popularity/types';
import validateParameters from 'core/image/quantz/popularity/validate-parameters';

describe('validating invalid popularity parameters should return an error', () => {
  it('should return a RangeError if regionSize is not of type [number, number, number]', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      regionSize: [10, 20],
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('regionSize should be of type [number, number, number]');
  });

  it('should return a TypeError if hue in regionSize is not an integer', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      regionSize: ['15', 20, 20],
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('hue in regionSize should be an integer');
  });

  it('should return a RangeError if hue in regionSize does not lie in [1, 360]', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      regionSize: [0, 20, 20],
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('hue in regionSize should lie in [1, 360]');
  });

  it('should return a RangeError if saturation in regionSize is not an integer', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      regionSize: [18, 'ten', 10],
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('saturation in regionSize should be an integer');
  });

  it('should return a RangeError if saturation in regionSize does not lie in [1, 100]', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      regionSize: [1, 128, 20],
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('saturation in regionSize should lie in [1, 100]');
  });

  it('should return a RangeError if lightness in regionSize is not an integer', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      regionSize: [18, 20, false],
    });

    expect(validatedParameters).to.be.an.instanceof(TypeError);
    expect(validatedParameters.message).to.equal('lightness in regionSize should be an integer');
  });

  it('should return a RangeError if lightness in regionSize does not lie in [1, 100]', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
      regionSize: [10, 50, 128],
    });

    expect(validatedParameters).to.be.an.instanceof(RangeError);
    expect(validatedParameters.message).to.equal('lightness in regionSize should lie in [1, 100]');
  });
});

describe('should provide the correct default values for the popularity algorithm', () => {
  it('should provide the default value for hue in regionSize if it was not provided', () => {
    const validatedParameters = validateParameters({
      imageElement: new Image(),
    });

    expect(validatedParameters).not.to.be.a('error');
    expect(validatedParameters).to.have.property('regionSize', DEFAULT_REGION_SIZE);
  });
});
