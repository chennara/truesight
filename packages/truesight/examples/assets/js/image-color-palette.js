const imageElements = document.querySelectorAll('figure.poster > img');

imageElements.forEach((imageElement) => {
  const parameters = {
    imageElement,
    numberOfColors: 8,
    quality: 5,
  };

  const createLogNode = (fn, elapsedTime) => {
    const methodNameNode = document.createElement('span');
    methodNameNode.className = 'tag has-text-dark-grey is-italic';
    methodNameNode.innerHTML = fn;

    const elapsedTimeNode = document.createElement('span');
    elapsedTimeNode.className = 'tag has-text-dark-grey has-background-white-bis';
    elapsedTimeNode.innerHTML = `${elapsedTime} ms`;

    const logNode = document.createElement('div');
    logNode.className = 'color-palette-log';
    logNode.appendChild(methodNameNode);
    logNode.appendChild(elapsedTimeNode);

    return logNode;
  };

  const createCanvasNode = (colorPalette) => {
    const canvasNode = document.createElement('div');
    canvasNode.className = 'color-palette-canvas';

    const totalPopulation = colorPalette.reduce((accumulator, entry) => accumulator + entry.population, 0);

    colorPalette.sort((entry, entry2) => entry2.population - entry.population);

    colorPalette.forEach((entry) => {
      const colorNode = document.createElement('span');
      colorNode.className = 'color-palette-color';
      colorNode.style.width = `${entry.population / totalPopulation * 100}%`;
      colorNode.style.backgroundColor = `rgb(${entry.color.red}, ${entry.color.green}, ${entry.color.blue})`;
      canvasNode.appendChild(colorNode);
    });

    return canvasNode;
  };

  const createSectionNode = async (fn) => {
    const t0 = performance.now();
    const colorPalette = await window.truesight[fn](parameters);
    const t1 = performance.now();
    const elapsedTime = Math.floor(t1 - t0 + 0.5);

    const logNode = createLogNode(fn, elapsedTime);
    const canvasNode = createCanvasNode(colorPalette);

    const sectionNode = document.createElement('div');
    sectionNode.className = 'card-content color-palette-section';
    sectionNode.appendChild(logNode);
    sectionNode.appendChild(canvasNode);

    return sectionNode;
  };

  const cardNode = imageElement.parentNode.parentNode.parentNode;

  ['reduceImage', 'popularizeImage'].forEach(async (fn) => {
    const sectionNode = await createSectionNode(fn);
    cardNode.appendChild(sectionNode);
  });
});
