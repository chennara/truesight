// @flow

export default async function loadImage(imageElement: HTMLImageElement): Promise<void> {
  return new Promise((resolve) => {
    if (imageElement.complete) {
      resolve();
    } else {
      const onImageLoad = () => {
        resolve();
        imageElement.removeEventListener('load', onImageLoad);
      };

      imageElement.addEventListener('load', onImageLoad);
    }
  });
}
