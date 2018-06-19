import { RGBImage } from 'core/image/rgb-image';
import { VALID_QUALITIES, DEFAULT_NUMBER_OF_COLORS, DEFAULT_QUALITY } from 'core/quantz/image/types';
import validateParameters from 'core/quantz/image/median-cut/validate-parameters';

import errorify from 'test-utils/errorify';

describe('validating invalid median cut parameters should return an error', () => {
  it('should return a RangeError if image could not be loaded', function runTest() {
    this.timeout(5000);

    const imageElement = new Image();
    imageElement.src = 'base/test/resources/images/baby-diver_2017.jpg';

    const result = errorify(
      validateParameters({
        imageElement,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('failed to load the image, timeout of 2000 ms exceeded');
    });
  });

  it('should return a RangeError if parameters argument includes an unknown property', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        numbetOfColors: 8,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('parameters argument includes unknown property numbetOfColors');
    });
  });

  it('should return a RangeError if parameters argument includes both rgbImage and imageElement property', () => {
    const imageElement = new Image();
    imageElement.src = 'base/test/resources/images/baby-driver_2017.jpg';

    const result = errorify(
      validateParameters({
        imageElement,
        rgbImage: new RGBImage(),
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('parameters argument includes unknown property rgbImage');
    });
  });

  it('should return a RangeError if parameters argument does not include rgbImage nor imageElement property', () => {
    const result = errorify(validateParameters({}));

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('parameters argument should include either imageElement or rgbImage property');
    });
  });

  it('should return a TypeError if image property is not of type RGBImage', () => {
    const result = errorify(
      validateParameters({
        rgbImage: [],
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('image property should be of type RGBImage');
    });
  });

  it('should return a TypeError if imageElement property is not of type HTMLImageElement nor HTMLCanvasElement', () => {
    const result = errorify(
      validateParameters({
        imageElement: "Maybe I'm wasting my young years",
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('imageElement property should be of type HTMLImageElement or HTMLCanvasElement');
    });
  });

  it('should return a TypeError if numberOfColors property is not an integer', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        numberOfColors: 9.5,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('numberOfColors property should be an integer');
    });
  });

  it('should return a RangeError if numberOfColors property does not lie in [1, 256]', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        numberOfColors: 270,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('numberOfColors property should lie in [1, 256]');
    });
  });

  it('should return a TypeError if quality property is not an integer', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        quality: true,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('quality property should be an integer');
    });
  });

  it(`should return a RangeError if quality property does not lie in ${VALID_QUALITIES.toString()}`, () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        quality: 100,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal(`quality property should lie in ${VALID_QUALITIES.toString()}`);
    });
  });
});

describe('should provide the correct default values for the median cut algorithm', () => {
  it('should provide the default value for numberOfColors property if it was not provided', () => {
    const result = validateParameters({
      rgbImage: new RGBImage(),
    });

    return result.then((validatedParameters) => {
      expect(validatedParameters).to.have.property('numberOfColors', DEFAULT_NUMBER_OF_COLORS);
    });
  });

  it('should provide the default value for quality property if it was not provided', () => {
    const result = validateParameters({
      rgbImage: new RGBImage(),
    });

    return result.then((validatedParameters) => {
      expect(validatedParameters).to.have.property('quality', DEFAULT_QUALITY);
    });
  });
});
