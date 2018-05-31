import { RGBColor } from 'core/color/rgb-color';
import { quantizeImage, reduceImage } from 'core/quantz/image/median-cut/quantize-image';
import loadImage from 'core/image/load-image';

import createRandomizedRGBImage from '../test-utils/create-randomized-rgb-image';
import drawImageToCanvasTestUtil from '../test-utils/draw-image-to-canvas';
import checkIfSimilarColors from '../test-utils/check-if-similar-colors';

describe('median cut should return an error if invalid image quantization parameters were provided', () => {
  it('should return a TypeError if image property is not of type RGBImage', async () => {
    let errorOccurred = false;

    try {
      await quantizeImage({
        rgbImage: [],
      });
    } catch (error) {
      errorOccurred = true;

      expect(error).to.be.an.instanceof(TypeError);
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('should return a RangeError if numberOfColors property does not lie in [1, 256]', async () => {
    let errorOccurred = false;

    try {
      await reduceImage({
        imageElement: new Image(),
        numberOfColors: -2,
      });
    } catch (error) {
      errorOccurred = true;

      expect(error).to.be.an.instanceof(RangeError);
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});

describe('median cut should return a map holding the expected number of colors (RGBImage)', () => {
  const imageSize = 2 ** 10;
  const rgbImage = createRandomizedRGBImage(imageSize);

  const testSuite = {
    parameters: {
      rgbImage,
      numberOfColors: 6,
      quality: 1,
    },
    expectedImageSize: imageSize,
    expectedColorPaletteSize: 6,
  };

  runExpectedNumberOfColorsTests(testSuite);
});

describe('median cut should return a map holding the expected number of colors (HTMLImageElement)', () => {
  const imageSize = 674 * 1000;
  const imageElement = new Image();
  imageElement.src = 'base/test/resources/images/baby-driver_2017.jpg';

  const testSuite = {
    parameters: {
      imageElement,
      numberOfColors: 8,
      quality: 20,
    },
    expectedImageSize: Math.floor(imageSize / 20),
    expectedColorPaletteSize: 8,
  };

  runExpectedNumberOfColorsTests(testSuite);
});

describe('median cut should return a map holding the expected number of colors (HTMLCanvasElement)', () => {
  const imageSize = 675 * 1000;
  const canvasElement = document.createElement('canvas');

  before(async () => {
    const imageElement = new Image();
    imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';

    await loadImage(imageElement);
    drawImageToCanvasTestUtil(imageElement, canvasElement);
  });

  const testSuite = {
    parameters: {
      imageElement: canvasElement,
      numberOfColors: 10,
      quality: 18,
    },
    expectedImageSize: Math.floor(imageSize / 18),
    expectedColorPaletteSize: 10,
  };

  runExpectedNumberOfColorsTests(testSuite);
});

function runExpectedNumberOfColorsTests(testSuite) {
  it('quantizeImage should return a map holding the expected number of colors', async () => {
    const inverseColorMap = await quantizeImage(testSuite.parameters);

    expect(inverseColorMap).to.have.lengthOf(testSuite.expectedImageSize);
  });

  // This doesn't always hold for images where a color heavily dominates the image: numberOfColors will then define
  // an upper bound for expectedColorPaletteSize.
  it('quantizeImage should return a map with the expected number of colors in range', async () => {
    const inverseColorMap = await quantizeImage(testSuite.parameters);
    const centroidsRange = [...new Set(inverseColorMap.map((entry) => entry.representativeColor))];

    expect(centroidsRange).to.have.lengthOf(testSuite.expectedColorPaletteSize);
  });

  // For previously mentioned images, some entries might be empty.
  it('reduceImage should return a palette holding the expected number of colors', async () => {
    const colorPalette = await reduceImage(testSuite.parameters);

    expect(colorPalette).to.have.lengthOf(testSuite.expectedColorPaletteSize);
  });

  it('reduceImage should return a palette with the expected number of colors in range', async () => {
    const colorPalette = await reduceImage(testSuite.parameters);
    const totalPopulation = colorPalette.reduce((accumulator, entry) => accumulator + entry.population, 0);

    expect(totalPopulation).to.equal(testSuite.expectedImageSize);
  });
}

describe('reduceImage should return a map holding the most dominant colors', () => {
  const imageElement = new Image();
  imageElement.src = 'base/test/resources/images/baby-driver_2017.jpg';

  it('should return a map holding the most dominant colors', async () => {
    const inverseColorMap = await reduceImage({
      imageElement,
      numberOfColors: 9,
      quality: 16,
    });

    const pinkishColor = new RGBColor([226, 75, 108]);
    const pinkishColorWasFound = inverseColorMap.some((entry) => checkIfSimilarColors(entry.color, pinkishColor));

    expect(pinkishColorWasFound).to.be.true; // eslint-disable-line no-unused-expressions

    const brownishColor = new RGBColor([150, 113, 87]);
    const brownishColorWasFound = inverseColorMap.some((entry) => checkIfSimilarColors(entry.color, brownishColor));

    expect(brownishColorWasFound).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
