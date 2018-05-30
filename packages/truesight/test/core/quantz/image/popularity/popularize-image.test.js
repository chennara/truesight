import { RGBColor } from 'core/color/rgb-color';
import popularizeImage from 'core/quantz/image/popularity/popularize-image';
import loadImage from 'core/image/load-image';

import createRandomizedRGBImage from '../test-utils/create-randomized-rgb-image';
import drawImageToCanvasTestUtil from '../test-utils/draw-image-to-canvas';
import checkIfSimilarColors from '../test-utils/check-if-similar-colors';

describe('popularizeImage should return a palette holding the expected number of colors (RGBImage)', () => {
  it('should return a palette holding the expected number of colors', async () => {
    const imageSize = 2 ** 12;
    const rgbImage = createRandomizedRGBImage(imageSize);

    const colorPalette = await popularizeImage({
      rgbImage,
      numberOfColors: 6,
      quality: 3,
    });

    expect(colorPalette).to.have.lengthOf(6);
  });
});

describe('popularizeImage should return a palette holding the expected number of colors (HTMLImageElement)', () => {
  it('should return a palette holding the expected number of colors', async () => {
    const imageElement = new Image();
    imageElement.src = 'base/test/resources/images/baby-driver_2017.jpg';

    const colorPalette = await popularizeImage({
      imageElement,
      numberOfColors: 6,
      quality: 19,
    });

    expect(colorPalette).to.have.lengthOf(6);
  });
});

describe('popularizeImage should return a palette holding the expected number of colors (HTMLCanvasElement)', () => {
  const canvasElement = document.createElement('canvas');

  before(async () => {
    const imageElement = new Image();
    imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';

    await loadImage(imageElement);
    drawImageToCanvasTestUtil(imageElement, canvasElement);
  });

  it('should return a palette holding the expected number of colors', async () => {
    const colorPalette = await popularizeImage({
      imageElement: canvasElement,
      numberOfColors: 16,
      quality: 19,
    });

    expect(colorPalette).to.have.lengthOf(16);
  });
});

describe('popularizeImage should return an error if invalid parameters were provided', () => {
  it('should return a RangeError if parameters argument does not include rgbImage nor imageElement property', async () => {
    let errorOccurred = false;

    try {
      await popularizeImage({});
    } catch (error) {
      expect(error).to.be.an.instanceof(RangeError);
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('should return a TypeError if regionSize property is not of type [number, number, number]', async () => {
    let errorOccurred = false;

    try {
      await popularizeImage({
        imageElement: new Image(),
        regionSize: [10, 20],
      });
    } catch (error) {
      expect(error).to.be.an.instanceof(TypeError);
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});

describe('popularizeImage should return a palette holding the most dominant colors', () => {
  it('should return a palette holding the most dominant colors', async () => {
    const imageElement = new Image();
    imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';

    const colorPalette = await popularizeImage({
      imageElement,
      quality: 20,
      regionSize: [10, 20, 20],
    });

    const reddishColor = new RGBColor([180, 15, 9]);
    const reddishColorWasFound = colorPalette.some((entry) => checkIfSimilarColors(entry.color, reddishColor));
    expect(reddishColorWasFound).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
