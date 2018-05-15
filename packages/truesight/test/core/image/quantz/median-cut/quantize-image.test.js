import { RGBColor } from 'core/color/rgb-color';
import { quantize, reduce } from 'core/image/quantz/median-cut/quantize-image';

import createRandomizedRGBImage from '../test-utils/create-randomized-rgb-image';
import drawImageToCanvas from '../test-utils/draw-image-to-canvas';
import checkIfSimilarColors from '../test-utils/check-if-similar-colors';

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
  const imageElement = new window.Image();
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

  before((done) => {
    const imageElement = new window.Image();

    imageElement.onload = () => {
      drawImageToCanvas(imageElement, canvasElement);
      done();
    };

    imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';
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
  it('quantize should return a map holding the expected number of colors', async () => {
    const inverseColorMap = await quantize(testSuite.parameters);

    expect(inverseColorMap).to.have.lengthOf(testSuite.expectedImageSize);
  });

  // This doesn't always hold for images where a color heavily dominates the image: numberOfColors will then define
  // an upper bound for expectedColorPaletteSize.
  it('quantize should return a map with the expected number of colors in range', async () => {
    const inverseColorMap = await quantize(testSuite.parameters);
    const centroidsRange = [...new Set(inverseColorMap.map((entry) => entry.representativeColor))];

    expect(centroidsRange).to.have.lengthOf(testSuite.expectedColorPaletteSize);
  });

  // For previously mentioned images, some entries might be empty.
  it('reduce should return a palette holding the expected number of colors', async () => {
    const colorPalette = await reduce(testSuite.parameters);

    expect(colorPalette).to.have.lengthOf(testSuite.expectedColorPaletteSize);
  });

  it('reduce should return a palette with the expected number of colors in range', async () => {
    const colorPalette = await reduce(testSuite.parameters);
    const totalPopulation = colorPalette.reduce((accumulator, entry) => accumulator + entry.population, 0);

    expect(totalPopulation).to.equal(testSuite.expectedImageSize);
  });
}

describe('median cut should return an error if invalid parameters were provided', () => {
  it('should return a TypeError if image is not of type RGBImage', async () => {
    let errorOccurred = false;

    try {
      await quantize({
        rgbImage: [],
      });
    } catch (error) {
      expect(error).to.be.an.instanceof(TypeError);
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('should return a RangeError if numberOfColors does not lie in [1, 256]', async () => {
    let errorOccurred = false;

    try {
      await reduce({
        imageElement: new window.Image(),
        numberOfColors: -2,
      });
    } catch (error) {
      expect(error).to.be.an.instanceof(RangeError);
      errorOccurred = true;
    }

    expect(errorOccurred).to.be.true; // eslint-disable-line no-unused-expressions
  });
});

describe('reduce should return a map holding the most dominant colors', () => {
  const imageElement = new window.Image();
  imageElement.src = 'base/test/resources/images/baby-driver_2017.jpg';

  it('should return a map holding the most dominant colors', async () => {
    const inverseColorMap = await reduce({
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
