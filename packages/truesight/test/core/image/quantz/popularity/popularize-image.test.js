import { RGBColor } from 'core/color/rgb-color';
import popularize from 'core/image/quantz/popularity/popularize-image';

import createRandomizedRGBImage from '../test-utils/create-randomized-rgb-image';
import drawImageToCanvas from '../test-utils/draw-image-to-canvas';
import checkIfSimilarColors from '../test-utils/check-if-similar-colors';

describe('popularize should return a palette holding the expected number of colors (RGBImage)', () => {
  it('should return a palette holding the expected number of colors', async () => {
    const imageSize = 2 ** 12;
    const rgbImage = createRandomizedRGBImage(imageSize);

    const colorPalette = await popularize({
      rgbImage,
      numberOfColors: 6,
      quality: 3,
    });

    expect(colorPalette).to.have.lengthOf(6);
  });
});

describe('popularize should return a palette holding the expected number of colors (HTMLImageElement)', () => {
  const imageElement = new Image();
  imageElement.src = 'base/test/resources/images/baby-driver_2017.jpg';

  it('should return a palette holding the expected number of colors', async () => {
    const colorPalette = await popularize({
      imageElement,
      numberOfColors: 6,
      quality: 19,
    });

    expect(colorPalette).to.have.lengthOf(6);
  });
});

describe('popularize should return a palette holding the expected number of colors (HTMLCanvasElement)', () => {
  const canvasElement = document.createElement('canvas');

  before((done) => {
    const imageElement = new Image();

    imageElement.onload = () => {
      drawImageToCanvas(imageElement, canvasElement);
      done();
    };

    imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';
  });

  it('should return a palette holding the expected number of colors', async () => {
    const colorPalette = await popularize({
      imageElement: canvasElement,
      numberOfColors: 16,
      quality: 19,
    });

    expect(colorPalette).to.have.lengthOf(16);
  });
});

describe('popularize should return an error if invalid parameters were provided', () => {
  it('should return a RangeError if parameters does not include rgbImage nor imageElement property', async () => {
    let errorOccurred = false;

    try {
      await popularize({});
    } catch (error) {
      expect(error).to.be.an.instanceof(RangeError);
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('should return a TypeError if image is not of type RGBImage', async () => {
    let errorOccurred = false;

    try {
      await popularize({
        rgbImage: [],
      });
    } catch (error) {
      expect(error).to.be.an.instanceof(TypeError);
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});

describe('popularize should return a palette holding the most dominant colors', () => {
  const imageElement = new Image();
  imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';

  it('should return a palette holding the most dominant colors', async () => {
    const colorPalette = await popularize({
      imageElement,
      quality: 20,
      regionSize: [10, 20, 20],
    });

    const reddishColor = new RGBColor([180, 15, 9]);
    const reddishColorWasFound = colorPalette.some((entry) => checkIfSimilarColors(entry.color, reddishColor));
    expect(reddishColorWasFound).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
