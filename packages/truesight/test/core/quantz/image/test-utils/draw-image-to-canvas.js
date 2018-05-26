export default function drawImageToCanvas(imageElement, canvasElement, done) {
  const onImageLoad = () => {
    canvasElement.width = imageElement.width; // eslint-disable-line no-param-reassign
    canvasElement.height = imageElement.height; // eslint-disable-line no-param-reassign

    const canvasContext = canvasElement.getContext('2d');
    canvasContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

    imageElement.removeEventListener('load', onImageLoad);
    done();
  };

  imageElement.addEventListener('load', onImageLoad);

  return canvasElement;
}
