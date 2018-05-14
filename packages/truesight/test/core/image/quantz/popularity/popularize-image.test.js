import { RGBColor } from 'core/color/rgb-color';
import popularize from 'core/image/quantz/popularity/popularize-image';

import createRandomizedRGBImage from '../test-utils/create-randomized-rgb-image';
import drawImageToCanvas from '../test-utils/draw-image-to-canvas';
import checkIfSimilarColors from '../test-utils/check-if-similar-colors';

describe('popularize should return a palette holding the expected number of colors (RGBImage)', () => {
  it('should return a palette holding the expected number of colors', () => {
    const imageSize = 2 ** 12;
    const rgbImage = createRandomizedRGBImage(imageSize);

    const colorPalette = popularize({
      rgbImage,
      numberOfColors: 6,
      quality: 3,
    });

    expect(colorPalette).to.have.lengthOf(6);
  });
});

describe('popularize should return a palette holding the expected number of colors (HTMLImageElement)', () => {
  const imageElement = new window.Image();

  before((done) => {
    imageElement.onload = () => done();
    imageElement.src = 'base/test/resources/images/baby-driver_2017.jpg';
  });

  it('should return a palette holding the expected number of colors', () => {
    const colorPalette = popularize({
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
    const imageElement = new window.Image();

    imageElement.onload = () => {
      canvasElement.width = imageElement.width;
      canvasElement.height = imageElement.height;

      drawImageToCanvas(imageElement, canvasElement);

      done();
    };

    imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';
  });

  it('should return a palette holding the expected number of colors', () => {
    const colorPalette = popularize({
      imageElement: canvasElement,
      numberOfColors: 16,
      quality: 19,
    });

    expect(colorPalette).to.have.lengthOf(16);
  });
});

describe('popularize should return an error if invalid parameters were provided', () => {
  it('should return a RangeError if parameters does not include rgbImage nor imageElement property', () => {
    const colorPalette = popularize({});

    expect(colorPalette).to.be.an.instanceof(RangeError);
  });

  it('should return a TypeError if image is not of type RGBImage', () => {
    const colorPalette = popularize({
      rgbImage: [],
    });

    expect(colorPalette).to.be.an.instanceof(TypeError);
  });
});

describe('popularize should return a palette holding the most dominant colors', () => {
  const imageElement = new window.Image();

  before((done) => {
    imageElement.onload = () => done();
    imageElement.src = 'base/test/resources/images/the-incredibles_2004.jpg';
  });

  it('should return a palette holding the most dominant colors', () => {
    const colorPalette = popularize({
      imageElement,
      quality: 20,
      regionSize: [10, 20, 20],
    });

    const reddishColor = new RGBColor([180, 15, 9]);
    const reddishColorWasFound = colorPalette.some((entry) => checkIfSimilarColors(entry.color, reddishColor));
    expect(reddishColorWasFound).to.be.true; // eslint-disable-line no-unused-expressions
  });
});
