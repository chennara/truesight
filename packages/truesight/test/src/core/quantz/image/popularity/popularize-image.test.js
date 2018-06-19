import { RGBColor } from 'core/color/rgb-color';
import popularizeImage from 'core/quantz/image/popularity/popularize-image';
import loadImage from 'core/image/load-image';

import createRandomizedRGBImage from 'test-utils/image/create-randomized-rgb-image';
import drawImageToCanvasTestUtil from 'test-utils/image/draw-image-to-canvas';
import checkIfSimilarColors from 'test-utils/color/check-if-similar-colors';
import errorify from 'test-utils/errorify';

describe('popularizeImage should return an error if invalid parameters were provided', () => {
  it('should return a RangeError if parameters argument does not include rgbImage nor imageElement property', () => {
    const result = errorify(popularizeImage({}));

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(RangeError);
    });
  });

  it('should return a TypeError if regionSize property is not of type [number, number, number]', () => {
    const result = errorify(
      popularizeImage({
        imageElement: new Image(),
        regionSize: [10, 20],
      })
    );

    return result.catch((error) => {
      expect(error).to.be.an.instanceof(TypeError);
    });
  });
});

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
