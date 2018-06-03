import { RGBImage } from 'core/image/rgb-image';
import { RGBColor } from 'core/color/rgb-color';

export default function createRandomizedRGBImage(imageSize) {
  const generateRandomChannelValue = () => Math.floor(Math.random() * 256);
  const imageData = new Array(imageSize)
    .fill(null)
    .map(
      () => new RGBColor([generateRandomChannelValue(), generateRandomChannelValue(), generateRandomChannelValue()])
    );
  const image = new RGBImage(imageData);

  return image;
}
