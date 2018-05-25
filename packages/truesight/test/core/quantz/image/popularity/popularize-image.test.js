import { RGBColor } from 'core/color/rgb-color';
import popularizeImage from 'core/quantz/image/popularity/popularize-image';

import createRandomizedRGBImage from '../test-utils/create-randomized-rgb-image';
import drawImageToCanvas from '../test-utils/draw-image-to-canvas';
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
  const imageElement = new Image();
  imageElement.src = 'base/test/resources/images/baby-driver_2017.jpg';

  it('should return a palette holding the expected number of colors', async () => {
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

  before((done) => {
    const imageElement = new Image();

    const onImageLoad = () => {
      drawImageToCanvas(imageElement, canvasElement);
      imageElement.removeEventListener('load', onImageLoad);
      done();
    };

    imageElement.addEventListener('load', onImageLoad);

    imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';
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
  it('should return a RangeError if parameters does not include rgbImage nor imageElement property', async () => {
    let errorOccurred = false;

    try {
      await popularizeImage({});
    } catch (error) {
      expect(error).to.be.an.instanceof(RangeError);
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('should return a TypeError if image is not of type RGBImage', async () => {
    let errorOccurred = false;

    try {
      await popularizeImage({
        rgbImage: [],
      });
    } catch (error) {
      expect(error).to.be.an.instanceof(TypeError);
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});

describe('popularizeImage should return a palette holding the most dominant colors', () => {
  const imageElement = new Image();
  imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';

  it('should return a palette holding the most dominant colors', async () => {
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
