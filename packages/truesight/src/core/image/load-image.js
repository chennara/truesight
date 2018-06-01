// @flow

export default async function loadImage(imageElement: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    const onImageLoad = () => {
      resolve();
      imageElement.removeEventListener('load', onImageLoad);
    };

    imageElement.addEventListener('load', onImageLoad);

    if (imageElement.complete) {
      resolve();
      imageElement.removeEventListener('load', onImageLoad);
    }
  });
}
