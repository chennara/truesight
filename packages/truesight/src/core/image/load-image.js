// @flow

export default async function loadImage(imageElement: HTMLImageElement, delay: number = 2000): Promise<void> {
  const loadImagePromise = new Promise((resolve) => {
    const onImageLoad = () => {
      imageElement.removeEventListener('load', onImageLoad);
      resolve();
    };

    imageElement.addEventListener('load', onImageLoad);

    if (imageElement.complete && imageElement.naturalWidth !== 0) {
      imageElement.removeEventListener('load', onImageLoad);
      resolve();
    }
  });

  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new RangeError(`failed to load the image, timeout of ${delay} ms exceeded`));
    }, delay);
  });

  return Promise.race([loadImagePromise, timeoutPromise]);
}
