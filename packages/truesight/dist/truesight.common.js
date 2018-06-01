/*!
 * truesight.common.js v0.1.0-alpha.1
 * Copyright (c) 2018-present, Chennara Nhes.
 * Released under the MIT License.
 */
'use strict';

var hsluv = hsluv || {};
hsluv.Geometry = function() {};
hsluv.Geometry.intersectLineLine = function(a, b) {
  var x = (a.intercept - b.intercept) / (b.slope - a.slope);
  var y = a.slope * x + a.intercept;
  return { x: x, y: y };
};
hsluv.Geometry.distanceFromOrigin = function(point) {
  return Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
};
hsluv.Geometry.distanceLineFromOrigin = function(line) {
  return Math.abs(line.intercept) / Math.sqrt(Math.pow(line.slope, 2) + 1);
};
hsluv.Geometry.perpendicularThroughPoint = function(line, point) {
  var slope = -1 / line.slope;
  var intercept = point.y - slope * point.x;
  return { slope: slope, intercept: intercept };
};
hsluv.Geometry.angleFromOrigin = function(point) {
  return Math.atan2(point.y, point.x);
};
hsluv.Geometry.normalizeAngle = function(angle) {
  var m = 2 * Math.PI;
  return (angle % m + m) % m;
};
hsluv.Geometry.lengthOfRayUntilIntersect = function(theta, line) {
  return line.intercept / (Math.sin(theta) - line.slope * Math.cos(theta));
};
hsluv.Hsluv = function() {};
hsluv.Hsluv.getBounds = function(L) {
  var result = [];
  var sub1 = Math.pow(L + 16, 3) / 1560896;
  var sub2 = sub1 > hsluv.Hsluv.epsilon ? sub1 : L / hsluv.Hsluv.kappa;
  var _g = 0;
  while (_g < 3) {
    var c = _g++;
    var m1 = hsluv.Hsluv.m[c][0];
    var m2 = hsluv.Hsluv.m[c][1];
    var m3 = hsluv.Hsluv.m[c][2];
    var _g1 = 0;
    while (_g1 < 2) {
      var t = _g1++;
      var top1 = (284517 * m1 - 94839 * m3) * sub2;
      var top2 = (838422 * m3 + 769860 * m2 + 731718 * m1) * L * sub2 - 769860 * t * L;
      var bottom = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t;
      result.push({ slope: top1 / bottom, intercept: top2 / bottom });
    }
  }
  return result;
};
hsluv.Hsluv.maxSafeChromaForL = function(L) {
  var bounds = hsluv.Hsluv.getBounds(L);
  var min = Infinity;
  var _g = 0;
  while (_g < bounds.length) {
    var bound = bounds[_g];
    ++_g;
    var length = hsluv.Geometry.distanceLineFromOrigin(bound);
    min = Math.min(min, length);
  }
  return min;
};
hsluv.Hsluv.maxChromaForLH = function(L, H) {
  var hrad = H / 360 * Math.PI * 2;
  var bounds = hsluv.Hsluv.getBounds(L);
  var min = Infinity;
  var _g = 0;
  while (_g < bounds.length) {
    var bound = bounds[_g];
    ++_g;
    var length = hsluv.Geometry.lengthOfRayUntilIntersect(hrad, bound);
    if (length >= 0) {
      min = Math.min(min, length);
    }
  }
  return min;
};
hsluv.Hsluv.dotProduct = function(a, b) {
  var sum = 0;
  var _g1 = 0;
  var _g = a.length;
  while (_g1 < _g) {
    var i = _g1++;
    sum += a[i] * b[i];
  }
  return sum;
};
hsluv.Hsluv.fromLinear = function(c) {
  if (c <= 0.0031308) {
    return 12.92 * c;
  } else {
    return 1.055 * Math.pow(c, 0.416666666666666685) - 0.055;
  }
};
hsluv.Hsluv.toLinear = function(c) {
  if (c > 0.04045) {
    return Math.pow((c + 0.055) / 1.055, 2.4);
  } else {
    return c / 12.92;
  }
};
hsluv.Hsluv.xyzToRgb = function(tuple) {
  return [
    hsluv.Hsluv.fromLinear(hsluv.Hsluv.dotProduct(hsluv.Hsluv.m[0], tuple)),
    hsluv.Hsluv.fromLinear(hsluv.Hsluv.dotProduct(hsluv.Hsluv.m[1], tuple)),
    hsluv.Hsluv.fromLinear(hsluv.Hsluv.dotProduct(hsluv.Hsluv.m[2], tuple)),
  ];
};
hsluv.Hsluv.rgbToXyz = function(tuple) {
  var rgbl = [hsluv.Hsluv.toLinear(tuple[0]), hsluv.Hsluv.toLinear(tuple[1]), hsluv.Hsluv.toLinear(tuple[2])];
  return [
    hsluv.Hsluv.dotProduct(hsluv.Hsluv.minv[0], rgbl),
    hsluv.Hsluv.dotProduct(hsluv.Hsluv.minv[1], rgbl),
    hsluv.Hsluv.dotProduct(hsluv.Hsluv.minv[2], rgbl),
  ];
};
hsluv.Hsluv.yToL = function(Y) {
  if (Y <= hsluv.Hsluv.epsilon) {
    return Y / hsluv.Hsluv.refY * hsluv.Hsluv.kappa;
  } else {
    return 116 * Math.pow(Y / hsluv.Hsluv.refY, 0.333333333333333315) - 16;
  }
};
hsluv.Hsluv.lToY = function(L) {
  if (L <= 8) {
    return hsluv.Hsluv.refY * L / hsluv.Hsluv.kappa;
  } else {
    return hsluv.Hsluv.refY * Math.pow((L + 16) / 116, 3);
  }
};
hsluv.Hsluv.xyzToLuv = function(tuple) {
  var X = tuple[0];
  var Y = tuple[1];
  var Z = tuple[2];
  var divider = X + 15 * Y + 3 * Z;
  var varU = 4 * X;
  var varV = 9 * Y;
  if (divider != 0) {
    varU /= divider;
    varV /= divider;
  } else {
    varU = NaN;
    varV = NaN;
  }
  var L = hsluv.Hsluv.yToL(Y);
  if (L == 0) {
    return [0, 0, 0];
  }
  var U = 13 * L * (varU - hsluv.Hsluv.refU);
  var V = 13 * L * (varV - hsluv.Hsluv.refV);
  return [L, U, V];
};
hsluv.Hsluv.luvToXyz = function(tuple) {
  var L = tuple[0];
  var U = tuple[1];
  var V = tuple[2];
  if (L == 0) {
    return [0, 0, 0];
  }
  var varU = U / (13 * L) + hsluv.Hsluv.refU;
  var varV = V / (13 * L) + hsluv.Hsluv.refV;
  var Y = hsluv.Hsluv.lToY(L);
  var X = 0 - 9 * Y * varU / ((varU - 4) * varV - varU * varV);
  var Z = (9 * Y - 15 * varV * Y - varV * X) / (3 * varV);
  return [X, Y, Z];
};
hsluv.Hsluv.luvToLch = function(tuple) {
  var L = tuple[0];
  var U = tuple[1];
  var V = tuple[2];
  var C = Math.sqrt(U * U + V * V);
  var H;
  if (C < 0.00000001) {
    H = 0;
  } else {
    var Hrad = Math.atan2(V, U);
    H = Hrad * 180.0 / Math.PI;
    if (H < 0) {
      H = 360 + H;
    }
  }
  return [L, C, H];
};
hsluv.Hsluv.lchToLuv = function(tuple) {
  var L = tuple[0];
  var C = tuple[1];
  var H = tuple[2];
  var Hrad = H / 360.0 * 2 * Math.PI;
  var U = Math.cos(Hrad) * C;
  var V = Math.sin(Hrad) * C;
  return [L, U, V];
};
hsluv.Hsluv.hsluvToLch = function(tuple) {
  var H = tuple[0];
  var S = tuple[1];
  var L = tuple[2];
  if (L > 99.9999999) {
    return [100, 0, H];
  }
  if (L < 0.00000001) {
    return [0, 0, H];
  }
  var max = hsluv.Hsluv.maxChromaForLH(L, H);
  var C = max / 100 * S;
  return [L, C, H];
};
hsluv.Hsluv.lchToHsluv = function(tuple) {
  var L = tuple[0];
  var C = tuple[1];
  var H = tuple[2];
  if (L > 99.9999999) {
    return [H, 0, 100];
  }
  if (L < 0.00000001) {
    return [H, 0, 0];
  }
  var max = hsluv.Hsluv.maxChromaForLH(L, H);
  var S = C / max * 100;
  return [H, S, L];
};
hsluv.Hsluv.hpluvToLch = function(tuple) {
  var H = tuple[0];
  var S = tuple[1];
  var L = tuple[2];
  if (L > 99.9999999) {
    return [100, 0, H];
  }
  if (L < 0.00000001) {
    return [0, 0, H];
  }
  var max = hsluv.Hsluv.maxSafeChromaForL(L);
  var C = max / 100 * S;
  return [L, C, H];
};
hsluv.Hsluv.lchToHpluv = function(tuple) {
  var L = tuple[0];
  var C = tuple[1];
  var H = tuple[2];
  if (L > 99.9999999) {
    return [H, 0, 100];
  }
  if (L < 0.00000001) {
    return [H, 0, 0];
  }
  var max = hsluv.Hsluv.maxSafeChromaForL(L);
  var S = C / max * 100;
  return [H, S, L];
};
hsluv.Hsluv.rgbToHex = function(tuple) {
  var h = '#';
  var _g = 0;
  while (_g < 3) {
    var i = _g++;
    var chan = tuple[i];
    var c = Math.round(chan * 255);
    var digit2 = c % 16;
    var digit1 = ((c - digit2) / 16) | 0;
    h += hsluv.Hsluv.hexChars.charAt(digit1) + hsluv.Hsluv.hexChars.charAt(digit2);
  }
  return h;
};
hsluv.Hsluv.hexToRgb = function(hex) {
  hex = hex.toLowerCase();
  var ret = [];
  var _g = 0;
  while (_g < 3) {
    var i = _g++;
    var digit1 = hsluv.Hsluv.hexChars.indexOf(hex.charAt(i * 2 + 1));
    var digit2 = hsluv.Hsluv.hexChars.indexOf(hex.charAt(i * 2 + 2));
    var n = digit1 * 16 + digit2;
    ret.push(n / 255.0);
  }
  return ret;
};
hsluv.Hsluv.lchToRgb = function(tuple) {
  return hsluv.Hsluv.xyzToRgb(hsluv.Hsluv.luvToXyz(hsluv.Hsluv.lchToLuv(tuple)));
};
hsluv.Hsluv.rgbToLch = function(tuple) {
  return hsluv.Hsluv.luvToLch(hsluv.Hsluv.xyzToLuv(hsluv.Hsluv.rgbToXyz(tuple)));
};
hsluv.Hsluv.hsluvToRgb = function(tuple) {
  return hsluv.Hsluv.lchToRgb(hsluv.Hsluv.hsluvToLch(tuple));
};
hsluv.Hsluv.rgbToHsluv = function(tuple) {
  return hsluv.Hsluv.lchToHsluv(hsluv.Hsluv.rgbToLch(tuple));
};
hsluv.Hsluv.hpluvToRgb = function(tuple) {
  return hsluv.Hsluv.lchToRgb(hsluv.Hsluv.hpluvToLch(tuple));
};
hsluv.Hsluv.rgbToHpluv = function(tuple) {
  return hsluv.Hsluv.lchToHpluv(hsluv.Hsluv.rgbToLch(tuple));
};
hsluv.Hsluv.hsluvToHex = function(tuple) {
  return hsluv.Hsluv.rgbToHex(hsluv.Hsluv.hsluvToRgb(tuple));
};
hsluv.Hsluv.hpluvToHex = function(tuple) {
  return hsluv.Hsluv.rgbToHex(hsluv.Hsluv.hpluvToRgb(tuple));
};
hsluv.Hsluv.hexToHsluv = function(s) {
  return hsluv.Hsluv.rgbToHsluv(hsluv.Hsluv.hexToRgb(s));
};
hsluv.Hsluv.hexToHpluv = function(s) {
  return hsluv.Hsluv.rgbToHpluv(hsluv.Hsluv.hexToRgb(s));
};
hsluv.Hsluv.m = [
  [3.240969941904521, -1.537383177570093, -0.498610760293],
  [-0.96924363628087, 1.87596750150772, 0.041555057407175],
  [0.055630079696993, -0.20397695888897, 1.056971514242878],
];
hsluv.Hsluv.minv = [
  [0.41239079926595, 0.35758433938387, 0.18048078840183],
  [0.21263900587151, 0.71516867876775, 0.072192315360733],
  [0.019330818715591, 0.11919477979462, 0.95053215224966],
];
hsluv.Hsluv.refY = 1.0;
hsluv.Hsluv.refU = 0.19783000664283;
hsluv.Hsluv.refV = 0.46831999493879;
hsluv.Hsluv.kappa = 903.2962962;
hsluv.Hsluv.epsilon = 0.0088564516;
hsluv.Hsluv.hexChars = '0123456789abcdef';
var root = {
  hsluvToRgb: hsluv.Hsluv.hsluvToRgb,
  rgbToHsluv: hsluv.Hsluv.rgbToHsluv,
  hpluvToRgb: hsluv.Hsluv.hpluvToRgb,
  rgbToHpluv: hsluv.Hsluv.rgbToHpluv,
  hsluvToHex: hsluv.Hsluv.hsluvToHex,
  hexToHsluv: hsluv.Hsluv.hexToHsluv,
  hpluvToHex: hsluv.Hsluv.hpluvToHex,
  hexToHpluv: hsluv.Hsluv.hexToHpluv,
  lchToHpluv: hsluv.Hsluv.lchToHpluv,
  hpluvToLch: hsluv.Hsluv.hpluvToLch,
  lchToHsluv: hsluv.Hsluv.lchToHsluv,
  hsluvToLch: hsluv.Hsluv.hsluvToLch,
  lchToLuv: hsluv.Hsluv.lchToLuv,
  luvToLch: hsluv.Hsluv.luvToLch,
  xyzToLuv: hsluv.Hsluv.xyzToLuv,
  luvToXyz: hsluv.Hsluv.luvToXyz,
  xyzToRgb: hsluv.Hsluv.xyzToRgb,
  rgbToXyz: hsluv.Hsluv.rgbToXyz,
  lchToRgb: hsluv.Hsluv.lchToRgb,
  rgbToLch: hsluv.Hsluv.rgbToLch,
};
var hsluv_1 = root;

class HSLuvColor {
  constructor(channels) {
    this.channels = channels;
  }
  toString() {
    return this.channels.toString();
  }
  toRGBColor() {
    const rgbChannels = hsluv_1.hsluvToRgb(this.channels).map((channel) => Math.floor(channel * 255 + 0.5));
    const rgbColor = new RGBColor(rgbChannels);
    return rgbColor;
  }
  static fromString(colorString) {
    const channels = colorString.split(',').map(Number);
    const color = new HSLuvColor([channels[0], channels[1], channels[2]]);
    return color;
  }
  get hue() {
    return this.channels[HUE_CHANNEL_INDEX];
  }
  get saturation() {
    return this.channels[SATURATION_CHANNEL_INDEX];
  }
  get lightness() {
    return this.channels[LIGHTNESS_CHANNEL_INDEX];
  }
}
const HUE_CHANNEL_INDEX = 0;
const SATURATION_CHANNEL_INDEX = 1;
const LIGHTNESS_CHANNEL_INDEX = 2;

class RGBColor {
  constructor(channels) {
    this.channels = channels;
  }
  toHSLuvColor() {
    const rgbChannels = this.channels.map((channel) => channel / 255);
    const hsluvChannels = hsluv_1.rgbToHsluv(rgbChannels);
    const hsluvColor = new HSLuvColor(hsluvChannels);
    return hsluvColor;
  }
  get red() {
    return this.channels[RED_CHANNEL_INDEX];
  }
  get green() {
    return this.channels[GREEN_CHANNEL_INDEX];
  }
  get blue() {
    return this.channels[BLUE_CHANNEL_INDEX];
  }
}
const RED_CHANNEL_INDEX = 0;
const GREEN_CHANNEL_INDEX = 1;
const BLUE_CHANNEL_INDEX = 2;

var loadImage = async function loadImage(imageElement) {
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
};

var getImageData = async function getImageData(imageElement) {
  if (imageElement instanceof HTMLImageElement) {
    return getImageDataFromHTMLImageElement(imageElement);
  }
  return getImageDataFromHTMLCanvasElement(imageElement);
};
async function getImageDataFromHTMLImageElement(imageElement) {
  await loadImage(imageElement);
  const canvasElement = drawImageToCanvas(imageElement);
  const imageData = getImageDataFromHTMLCanvasElement(canvasElement);
  return imageData;
}
function drawImageToCanvas(imageElement) {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = imageElement.width;
  canvasElement.height = imageElement.height;
  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);
  return canvasElement;
}
function getImageDataFromHTMLCanvasElement(canvasElement) {
  const canvasContext = canvasElement.getContext('2d');
  const imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height).data;
  return imageData;
}

class RGBImage {
  constructor(data) {
    this.data = data;
  }
  static async fromImageElement(imageElement, quality) {
    const rgbImageData = [];
    const rgbaImageData = await getImageData(imageElement);
    const numberOfEntriesToSkip = 4 * (quality - 1);
    for (let i = numberOfEntriesToSkip; i < rgbaImageData.length; i += 4 + numberOfEntriesToSkip) {
      const rgbColor = new RGBColor([
        rgbaImageData[i + RED_CHANNEL_INDEX],
        rgbaImageData[i + GREEN_CHANNEL_INDEX],
        rgbaImageData[i + BLUE_CHANNEL_INDEX],
      ]);
      rgbImageData.push(rgbColor);
    }
    return new RGBImage(rgbImageData);
  }
}

class Interval {
  constructor(begin, end) {
    this.begin = begin;
    this.end = end;
  }
  liesIn(value) {
    return value >= this.begin && value <= this.end;
  }
  toString() {
    return `[${this.begin}, ${this.end}]`;
  }
}

const HIGHEST_QUALITY = 1;
const LOWEST_QUALITY = 25;
const VALID_QUALITIES = new Interval(HIGHEST_QUALITY, LOWEST_QUALITY);
const DEFAULT_NUMBER_OF_COLORS = 8;
const DEFAULT_QUALITY = HIGHEST_QUALITY;

function validateParameters(parameters) {
  const unknownProperties = getUnknownProperties(parameters);
  if (unknownProperties.length !== 0) {
    return new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`);
  }
  if (!parameters.rgbImage && !parameters.imageElement) {
    return new RangeError('parameters argument should include either rgbImage or imageElement property');
  }
  if (parameters.rgbImage) {
    return validateRGBImageConfiguration(parameters);
  }
  return validateImageElementConfiguration(parameters);
}
function getUnknownProperties(parameters) {
  const properties = Object.keys(parameters);
  const validBaseProperties = ['numberOfColors', 'quality'];
  const validRGBImageProperties = ['rgbImage', ...validBaseProperties];
  const validImageElementProperties = ['imageElement', ...validBaseProperties];
  const unknownRGBImageProperties = properties.filter((property) => !validRGBImageProperties.includes(property));
  return unknownRGBImageProperties.length === 0
    ? unknownRGBImageProperties
    : properties.filter((property) => !validImageElementProperties.includes(property));
}
function validateRGBImageConfiguration(parameters) {
  const { rgbImage } = parameters;
  if (!(rgbImage instanceof RGBImage)) {
    return new TypeError('image property should be of type RGBImage');
  }
  return validateBaseConfiguration(parameters);
}
function validateImageElementConfiguration(parameters) {
  const { imageElement } = parameters;
  if (!(imageElement instanceof HTMLImageElement) && !(imageElement instanceof HTMLCanvasElement)) {
    return new TypeError('imageElement property should be of type HTMLImageElement or HTMLCanvasElement');
  }
  return validateBaseConfiguration(parameters);
}
function validateBaseConfiguration(parameters) {
  const { numberOfColors = DEFAULT_NUMBER_OF_COLORS, quality = DEFAULT_QUALITY } = parameters;
  if (!Number.isInteger(numberOfColors)) {
    return new TypeError('numberOfColors property should be an integer');
  }
  if (!(numberOfColors >= 1 && numberOfColors <= 256)) {
    return new RangeError('numberOfColors property should lie in [1, 256]');
  }
  if (!Number.isInteger(quality)) {
    return new TypeError('quality property should be an integer');
  }
  if (!VALID_QUALITIES.liesIn(quality)) {
    return new RangeError(`quality property should lie in ${VALID_QUALITIES.toString()}`);
  }
  if (parameters.rgbImage) {
    return { rgbImage: parameters.rgbImage, numberOfColors, quality };
  }
  return { imageElement: parameters.imageElement, numberOfColors, quality };
}

function quantizeImage(parameters) {
  return runMedianCut(parameters, buildInverseColorMap);
}
function reduceImage(parameters) {
  return runMedianCut(parameters, buildColorPalette);
}
async function runMedianCut(parameters, buildColorMap) {
  const validatedParameters = validateParameters(parameters);
  if (validatedParameters instanceof Error) {
    return Promise.reject(validatedParameters);
  }
  const rgbImage = await extractRGBImage(validatedParameters);
  const vboxes = findMostDominantColors(rgbImage, validatedParameters.numberOfColors);
  const colorMap = buildColorMap(vboxes);
  return colorMap;
}
async function extractRGBImage(parameters) {
  return parameters.rgbImage
    ? parameters.rgbImage
    : RGBImage.fromImageElement(parameters.imageElement, parameters.quality);
}
function findMostDominantColors(image, numberOfColors) {
  let vboxes = [image.data];
  for (let i = 0; i < numberOfColors - 1; i += 1) {
    const largestVbox = findLargestVbox(vboxes);
    const longestAxis = findLongestAxis(largestVbox);
    const splittedVboxes = splitAlongAxis(largestVbox, longestAxis);
    vboxes.splice(vboxes.indexOf(largestVbox), 1);
    vboxes = vboxes.concat(splittedVboxes);
  }
  return vboxes;
}
function findLargestVbox(vboxes) {
  return vboxes.reduce((previous, current) => (current.length > previous.length ? current : previous));
}
function findLongestAxis(vbox) {
  class RGBColorAxis {
    constructor(axis) {
      this.axis = axis;
      this.minMax = [255, 0];
    }
    updateMinMax(value) {
      this.minMax = [Math.min(value, this.minMax[0]), Math.max(value, this.minMax[1])];
    }
    get width() {
      return this.minMax[1] - this.minMax[0];
    }
  }
  const rgbColorAxes = [
    new RGBColorAxis(RED_CHANNEL_INDEX),
    new RGBColorAxis(GREEN_CHANNEL_INDEX),
    new RGBColorAxis(BLUE_CHANNEL_INDEX),
  ];
  vbox.forEach((color) => {
    rgbColorAxes[RED_CHANNEL_INDEX].updateMinMax(color.red);
    rgbColorAxes[GREEN_CHANNEL_INDEX].updateMinMax(color.green);
    rgbColorAxes[BLUE_CHANNEL_INDEX].updateMinMax(color.blue);
  });
  const longestAxis = rgbColorAxes.reduce((previous, current) => (current.width > previous.width ? current : previous));
  return longestAxis.axis;
}
function splitAlongAxis(vbox, axis) {
  const median = findAxisMedian(vbox, axis);
  const vboxes = splitOnAxisMedian(vbox, axis, median);
  return vboxes;
}
function findAxisMedian(vbox, axis) {
  const extractedChannelValues = vbox
    .map((color) => color.channels[axis])
    .sort((previous, current) => previous - current);
  const median = extractedChannelValues[Math.floor(extractedChannelValues.length / 2) - 1];
  return median;
}
function splitOnAxisMedian(vbox, axis, median) {
  const groupByAxisMedian = (color) => (color.channels[axis] <= median ? 0 : 1);
  const vboxes = vbox.reduce(
    (accumulator, color) => {
      accumulator[groupByAxisMedian(color)].push(color);
      return accumulator;
    },
    [[], []]
  );
  return vboxes;
}
function buildInverseColorMap(vboxes) {
  const inverseColorMap = vboxes.map((vbox) => {
    const representativeColor = findRepresentativeColor(vbox);
    return vbox.map((color) => ({
      sourceColor: color,
      representativeColor,
    }));
  });
  return [].concat(...inverseColorMap);
}
function buildColorPalette(vboxes) {
  return vboxes.map((vbox) => ({
    color: findRepresentativeColor(vbox),
    population: vbox.length,
  }));
}
function findRepresentativeColor(vbox) {
  const colorSum = vbox.reduce(
    (accumulator, color) => [
      accumulator[RED_CHANNEL_INDEX] + color.red,
      accumulator[GREEN_CHANNEL_INDEX] + color.green,
      accumulator[BLUE_CHANNEL_INDEX] + color.blue,
    ],
    [0, 0, 0]
  );
  const colorAverage = colorSum.map((channelSum) => Math.floor(channelSum / vbox.length + 0.5));
  return new RGBColor([
    colorAverage[RED_CHANNEL_INDEX],
    colorAverage[GREEN_CHANNEL_INDEX],
    colorAverage[BLUE_CHANNEL_INDEX],
  ]);
}

class HSLuvImage {
  constructor(data) {
    this.data = data;
  }
  static fromRGBImage(rgbImage, quality) {
    const hsluvImageData = [];
    const numberOfPixelsToSkip = quality - 1;
    for (let i = numberOfPixelsToSkip; i < rgbImage.data.length; i += 1 + numberOfPixelsToSkip) {
      const rgbChannels = [rgbImage.data[i].red, rgbImage.data[i].green, rgbImage.data[i].blue];
      const rgbColor = new RGBColor(rgbChannels);
      const hsluvColor = rgbColor.toHSLuvColor();
      hsluvImageData.push(hsluvColor);
    }
    return new HSLuvImage(hsluvImageData);
  }
  static async fromImageElement(imageElement, quality) {
    const hsluvImageData = [];
    const rgbaImageData = await getImageData(imageElement);
    const numberOfEntriesToSkip = 4 * (quality - 1);
    for (let i = numberOfEntriesToSkip; i < rgbaImageData.length; i += 4 + numberOfEntriesToSkip) {
      const rgbChannels = [
        rgbaImageData[i + RED_CHANNEL_INDEX],
        rgbaImageData[i + GREEN_CHANNEL_INDEX],
        rgbaImageData[i + BLUE_CHANNEL_INDEX],
      ];
      const rgbColor = new RGBColor(rgbChannels);
      const hsluvColor = rgbColor.toHSLuvColor();
      hsluvImageData.push(hsluvColor);
    }
    return new HSLuvImage(hsluvImageData);
  }
}

const DEFAULT_REGION_SIZE = [15, 20, 20];

var _extends =
  Object.assign ||
  function(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

function validateParameters$1(parameters) {
  const unknownProperties = getUnknownProperties$1(parameters);
  if (unknownProperties.length !== 0) {
    return new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`);
  }
  const { regionSize = DEFAULT_REGION_SIZE } = parameters;
  if (regionSize.length !== 3) {
    return new TypeError('regionSize property should be of type [number, number, number]');
  }
  const [hue, saturation, lightness] = regionSize;
  if (!Number.isInteger(hue)) {
    return new TypeError('hue in regionSize property should be an integer');
  }
  if (!(hue >= 1 && hue <= 360)) {
    return new RangeError('hue in regionSize property should lie in [1, 360]');
  }
  if (!Number.isInteger(saturation)) {
    return new TypeError('saturation in regionSize property should be an integer');
  }
  if (!(saturation >= 1 && saturation <= 100)) {
    return new RangeError('saturation in regionSize property should lie in [1, 100]');
  }
  if (!Number.isInteger(lightness)) {
    return new TypeError('lightness in regionSize property should be an integer');
  }
  if (!(lightness >= 1 && lightness <= 100)) {
    return new RangeError('lightness in regionSize property should lie in [1, 100]');
  }
  const validatedBaseParameters = validateBaseParameters(parameters);
  if (validatedBaseParameters instanceof Error) {
    return validatedBaseParameters;
  }
  return _extends({}, validatedBaseParameters, {
    regionSize,
  });
}
function getUnknownProperties$1(parameters) {
  const properties = Object.keys(parameters);
  const validBaseProperties = ['numberOfColors', 'quality', 'regionSize'];
  const validRGBImageProperties = ['rgbImage', ...validBaseProperties];
  const validImageElementProperties = ['imageElement', ...validBaseProperties];
  const unknownRGBImageProperties = properties.filter((property) => !validRGBImageProperties.includes(property));
  return unknownRGBImageProperties.length === 0
    ? unknownRGBImageProperties
    : properties.filter((property) => !validImageElementProperties.includes(property));
}
function validateBaseParameters(parameters) {
  if (parameters.rgbImage) {
    const { rgbImage, numberOfColors, quality } = parameters;
    return validateParameters({ rgbImage, numberOfColors, quality });
  }
  const { imageElement, numberOfColors, quality } = parameters;
  return validateParameters({ imageElement, numberOfColors, quality });
}

function mapColorToRegionID(color, regionSize) {
  const hueIntervals = [];
  for (let i = 0; i < 360 + regionSize[HUE_CHANNEL_INDEX]; i += regionSize[HUE_CHANNEL_INDEX]) {
    hueIntervals.push(Math.min(i, 360));
  }
  const saturationIntervals = [];
  for (let i = 0; i < 100 + regionSize[SATURATION_CHANNEL_INDEX]; i += regionSize[SATURATION_CHANNEL_INDEX]) {
    saturationIntervals.push(Math.min(i, 100));
  }
  const lightnessIntervals = [];
  for (let i = 0; i < 100 + regionSize[LIGHTNESS_CHANNEL_INDEX]; i += regionSize[LIGHTNESS_CHANNEL_INDEX]) {
    lightnessIntervals.push(Math.min(i, 100));
  }
  return [
    mapChannelToRegionID(hueIntervals, color.hue),
    mapChannelToRegionID(saturationIntervals, color.saturation),
    mapChannelToRegionID(lightnessIntervals, color.lightness),
  ].join(',');
}
function mapChannelToRegionID(intervals, channel) {
  let i = 0;
  while (channel >= intervals[i] && i < intervals.length) {
    i += 1;
  }
  return [intervals[i - 1], intervals[i]].toString();
}

var popularizeImage = async function popularizeImage(parameters) {
  const validatedParameters = validateParameters$1(parameters);
  if (validatedParameters instanceof Error) {
    return Promise.reject(validatedParameters);
  }
  const hsluvImage = await extractHSLuvImage(validatedParameters);
  const colorPalette = buildColorPalette$1(
    hsluvImage,
    validatedParameters.regionSize,
    validatedParameters.numberOfColors
  );
  return colorPalette;
};
async function extractHSLuvImage(parameters) {
  return parameters.rgbImage
    ? HSLuvImage.fromRGBImage(parameters.rgbImage, parameters.quality)
    : HSLuvImage.fromImageElement(parameters.imageElement, parameters.quality);
}
function buildColorPalette$1(image, regionSize, numberOfColors) {
  const histogram = buildHistogram(image, regionSize);
  const colorPalette = findMostDominantColors$1(histogram, numberOfColors);
  return colorPalette;
}
function buildHistogram(image, regionSize) {
  const histogram = new Map();
  image.data.forEach((color) => {
    const regionID = mapColorToRegionID(color, regionSize);
    const colorID = color.toString();
    const regionHistogram = histogram.get(regionID);
    if (!regionHistogram) {
      histogram.set(regionID, new Map([[colorID, 1]]));
    } else {
      const colorPopulation = regionHistogram.get(colorID);
      if (!colorPopulation) {
        regionHistogram.set(colorID, 1);
      } else {
        regionHistogram.set(colorID, colorPopulation + 1);
      }
    }
  });
  return Array.from(histogram.entries()).map((region) => [
    region[0],
    Array.from(region[1].entries()).map((color) => [color[0], color[1]]),
  ]);
}
function findMostDominantColors$1(histogram, numberOfColors) {
  const mostDominantRegions = findMostDominantRegions(histogram, numberOfColors);
  const mostDominantColors = mostDominantRegions.map((region) => findMostDominantColor(region[1]));
  return mostDominantColors;
}
function findMostDominantRegions(histogram, numberOfColors) {
  const regions = histogram.map((region) => ({
    regionID: region[0],
    population: getRegionPopulation(region[1]),
  }));
  regions.sort((previous, current) => current.population - previous.population);
  const mostDominantRegionIDs = regions.slice(0, numberOfColors).map((region) => region.regionID);
  const mostDominantRegions = histogram.filter((region) => mostDominantRegionIDs.includes(region[0]));
  return mostDominantRegions;
}
function findMostDominantColor(histogram) {
  const mostDominantColorEntry = histogram
    .map((color) => ({
      color: HSLuvColor.fromString(color[0]),
      population: color[1],
    }))
    .reduce((previous, current) => (current.population > previous.population ? current : previous));
  return {
    color: mostDominantColorEntry.color.toRGBColor(),
    population: getRegionPopulation(histogram),
  };
}
function getRegionPopulation(histogram) {
  return histogram.reduce((accumulator, color) => accumulator + color[1], 0);
}

var ImageQuantizationAPI = {
  quantizeImage,
  reduceImage,
  popularizeImage,
};

class AsyncQueue {
  constructor() {
    this.values = [];
    this.settlers = [];
    this.closed = false;
  }
  enqueue(value) {
    if (this.closed) {
      throw new Error('unable to enqueue a task onto a closed queue');
    } else if (this.settlers.length === 0) {
      this.values.push(value);
    } else {
      const settler = this.settlers.shift();
      if (value instanceof Error) {
        settler.reject(value);
      } else {
        settler.resolve({ done: false, value });
      }
    }
  }
  [Symbol.asyncIterator]() {
    return this;
  }
  next() {
    if (this.values.length > 0) {
      const value = this.values.shift();
      if (value instanceof Error) {
        return Promise.reject(value);
      }
      return Promise.resolve({ done: false, value });
    } else if (this.closed) {
      return Promise.resolve({ done: true });
    }
    return new Promise((resolve, reject) => {
      this.settlers.push({ resolve, reject });
    });
  }
  close() {
    if (this.settlers.length > 0) {
      const settler = this.settlers.shift();
      settler.resolve({ done: true });
    }
    this.closed = true;
  }
}

function loadVideo(videoElement) {
  return new Promise((resolve) => {
    const onVideoLoad = () => {
      resolve();
      videoElement.removeEventListener('loadeddata', onVideoLoad);
    };
    videoElement.addEventListener('loadeddata', onVideoLoad);
    if (videoElement.readyState === 4) {
      resolve();
      videoElement.removeEventListener('loadeddata', onVideoLoad);
    }
  });
}

const DEFAULT_SECONDS_BETWEEN_FRAMES = 1;

function validateParameters$2(parameters) {
  const unknownProperties = getUnknownProperties$2(parameters);
  if (unknownProperties.length !== 0) {
    return new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`);
  }
  const { videoElement, secondsBetweenFrames = DEFAULT_SECONDS_BETWEEN_FRAMES } = parameters;
  if (!videoElement) {
    return new RangeError('parameters argument should include videoElement property');
  }
  if (!(videoElement instanceof HTMLVideoElement)) {
    return new TypeError('videoElement property should be of type HTMLVideoElement');
  }
  if (videoElement.width === 0) {
    return new RangeError('width attribute in videoElement property is 0');
  }
  if (videoElement.height === 0) {
    return new RangeError('height attribute in videoElement property is 0');
  }
  if (!Number.isFinite(secondsBetweenFrames)) {
    return new TypeError('secondsBetweenFrames property should be a number');
  }
  if (secondsBetweenFrames <= 0) {
    return new RangeError('secondsBetweenFrames property should be greater than 0');
  }
  return { videoElement, secondsBetweenFrames };
}
function getUnknownProperties$2(parameters) {
  const properties = Object.keys(parameters);
  const validProperties = ['videoElement', 'secondsBetweenFrames'];
  return properties.filter((property) => !validProperties.includes(property));
}

var parseVideo = async function* parseVideo(parameters, parseFrame) {
  const validatedParameters = validateParameters$2(parameters);
  if (validatedParameters instanceof Error) {
    throw validatedParameters;
  }
  yield* parseFrames(validatedParameters, parseFrame);
};
async function* parseFrames(parameters, parseFrame) {
  const parsingResults = new AsyncQueue();
  const videoElement = parameters.videoElement.cloneNode();
  videoElement.preload = 'auto';
  await loadVideo(videoElement);
  let currentTime = 0;
  let index = 1;
  videoElement.currentTime = currentTime;
  const parseNextFrame = async () => {
    try {
      const canvasElement = drawFrameToCanvas(videoElement);
      const parsingResult = await parseFrame(canvasElement);
      parsingResults.enqueue({
        index,
        timestamp: currentTime,
        result: parsingResult,
      });
      currentTime += parameters.secondsBetweenFrames;
      index += 1;
      if (currentTime <= videoElement.duration) {
        videoElement.currentTime = currentTime;
      } else {
        parsingResults.close();
        videoElement.removeEventListener('seeked', parseNextFrame);
      }
    } catch (error) {
      parsingResults.close();
      videoElement.removeEventListener('seeked', parseNextFrame);
    }
  };
  await parseNextFrame();
  videoElement.addEventListener('seeked', parseNextFrame);
  yield* getNextParsingResult(parsingResults);
}
function drawFrameToCanvas(videoElement) {
  const canvasElement = document.createElement('canvas');
  canvasElement.width = videoElement.width;
  canvasElement.height = videoElement.height;
  const canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
  return canvasElement;
}
async function* getNextParsingResult(parsingResults) {
  const parsingResult = await parsingResults.next();
  if (!parsingResult.done) {
    yield parsingResult.value;
    yield* getNextParsingResult(parsingResults);
  }
}

function quantizeVideo(parameters) {
  const [videoParsingParameters, medianCutBaseParameters] = extractParameters(parameters);
  const quantizeImageWrapper = (canvasElement) =>
    quantizeImage(
      _extends(
        {
          imageElement: canvasElement,
        },
        medianCutBaseParameters
      )
    );
  return parseVideo(videoParsingParameters, quantizeImageWrapper);
}
function reduceVideo(parameters) {
  const [videoParsingParameters, medianCutBaseParameters] = extractParameters(parameters);
  const reduceImageWrapper = (canvasElement) =>
    reduceImage(
      _extends(
        {
          imageElement: canvasElement,
        },
        medianCutBaseParameters
      )
    );
  return parseVideo(videoParsingParameters, reduceImageWrapper);
}
function extractParameters(parameters) {
  const { videoElement, secondsBetweenFrames, numberOfColors, quality } = parameters;
  return [{ videoElement, secondsBetweenFrames }, { numberOfColors, quality }];
}

function popularizeVideo(parameters) {
  const [videoParsingParameters, medianCutBaseParameters] = extractParameters$1(parameters);
  const popularizeImageWrapper = (canvasElement) =>
    popularizeImage(
      _extends(
        {
          imageElement: canvasElement,
        },
        medianCutBaseParameters
      )
    );
  return parseVideo(videoParsingParameters, popularizeImageWrapper);
}
function extractParameters$1(parameters) {
  const { videoElement, secondsBetweenFrames, numberOfColors, quality, regionSize } = parameters;
  return [{ videoElement, secondsBetweenFrames }, { numberOfColors, quality, regionSize }];
}

var VideoQuantizationAPI = {
  quantizeVideo,
  reduceVideo,
  popularizeVideo,
};

var index = _extends(
  {
    RGBImage,
  },
  ImageQuantizationAPI,
  VideoQuantizationAPI
);

module.exports = index;
