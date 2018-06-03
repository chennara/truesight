import { RGBImage } from 'core/image/rgb-image';
import { DEFAULT_REGION_SIZE } from 'core/quantz/image/popularity/types';
import validateParameters from 'core/quantz/image/popularity/validate-parameters';

import errorify from 'test-utils/errorify';

describe('validating invalid popularity parameters should return an error', () => {
  it('should return a RangeError if image could not be loaded', function runTest() {
    this.timeout(5000);

    const imageElement = new Image();
    imageElement.src = 'base/test/resources/images/the-imcredibles_2004.jpg';

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
        regionDimensions: [10, 23, 17],
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('parameters argument includes unknown property regionDimensions');
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

  it('should return a TypeError if regionSize property is not of type [number, number, number]', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        regionSize: 17,
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('regionSize property should be of type [number, number, number]');
    });
  });

  it('should return a TypeError if hue in regionSize property is not an integer', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        regionSize: ['15', 20, 20],
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('hue in regionSize property should be an integer');
    });
  });

  it('should return a RangeError if hue in regionSize property does not lie in [1, 360]', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        regionSize: [0, 20, 20],
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('hue in regionSize property should lie in [1, 360]');
    });
  });

  it('should return a RangeError if saturation in regionSize property is not an integer', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        regionSize: [18, 'ten', 10],
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('saturation in regionSize property should be an integer');
    });
  });

  it('should return a RangeError if saturation in regionSize property does not lie in [1, 100]', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        regionSize: [1, 128, 20],
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('saturation in regionSize property should lie in [1, 100]');
    });
  });

  it('should return a RangeError if lightness in regionSize property is not an integer', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        regionSize: [18, 20, false],
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
      expect(error.message).to.equal('lightness in regionSize property should be an integer');
    });
  });

  it('should return a RangeError if lightness in regionSize property does not lie in [1, 100]', () => {
    const result = errorify(
      validateParameters({
        rgbImage: new RGBImage(),
        regionSize: [10, 50, 128],
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
      expect(error.message).to.equal('lightness in regionSize property should lie in [1, 100]');
    });
  });
});

describe('should provide the correct default values for the popularity algorithm', () => {
  it('should provide the default value for hue in regionSize property if it was not provided', () => {
    const result = validateParameters({
      rgbImage: new RGBImage(),
    });

    return result.then((validatedParameters) => {
      expect(validatedParameters).to.have.property('regionSize', DEFAULT_REGION_SIZE);
    });
  });
});
