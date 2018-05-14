/*!
 * truesight.common.js v0.1.0-alpha.1
 * Copyright (c) 2018-present, Chennara Nhes.
 * Released under the MIT License.
 */
'use strict';

// Generated by Haxe 3.4.4
var hsluv = hsluv || {};
hsluv.Geometry = function() { };
hsluv.Geometry.intersectLineLine = function(a,b) {
	var x = (a.intercept - b.intercept) / (b.slope - a.slope);
	var y = a.slope * x + a.intercept;
	return { x : x, y : y};
};
hsluv.Geometry.distanceFromOrigin = function(point) {
	return Math.sqrt(Math.pow(point.x,2) + Math.pow(point.y,2));
};
hsluv.Geometry.distanceLineFromOrigin = function(line) {
	return Math.abs(line.intercept) / Math.sqrt(Math.pow(line.slope,2) + 1);
};
hsluv.Geometry.perpendicularThroughPoint = function(line,point) {
	var slope = -1 / line.slope;
	var intercept = point.y - slope * point.x;
	return { slope : slope, intercept : intercept};
};
hsluv.Geometry.angleFromOrigin = function(point) {
	return Math.atan2(point.y,point.x);
};
hsluv.Geometry.normalizeAngle = function(angle) {
	var m = 2 * Math.PI;
	return (angle % m + m) % m;
};
hsluv.Geometry.lengthOfRayUntilIntersect = function(theta,line) {
	return line.intercept / (Math.sin(theta) - line.slope * Math.cos(theta));
};
hsluv.Hsluv = function() { };
hsluv.Hsluv.getBounds = function(L) {
	var result = [];
	var sub1 = Math.pow(L + 16,3) / 1560896;
	var sub2 = sub1 > hsluv.Hsluv.epsilon ? sub1 : L / hsluv.Hsluv.kappa;
	var _g = 0;
	while(_g < 3) {
		var c = _g++;
		var m1 = hsluv.Hsluv.m[c][0];
		var m2 = hsluv.Hsluv.m[c][1];
		var m3 = hsluv.Hsluv.m[c][2];
		var _g1 = 0;
		while(_g1 < 2) {
			var t = _g1++;
			var top1 = (284517 * m1 - 94839 * m3) * sub2;
			var top2 = (838422 * m3 + 769860 * m2 + 731718 * m1) * L * sub2 - 769860 * t * L;
			var bottom = (632260 * m3 - 126452 * m2) * sub2 + 126452 * t;
			result.push({ slope : top1 / bottom, intercept : top2 / bottom});
		}
	}
	return result;
};
hsluv.Hsluv.maxSafeChromaForL = function(L) {
	var bounds = hsluv.Hsluv.getBounds(L);
	var min = Infinity;
	var _g = 0;
	while(_g < bounds.length) {
		var bound = bounds[_g];
		++_g;
		var length = hsluv.Geometry.distanceLineFromOrigin(bound);
		min = Math.min(min,length);
	}
	return min;
};
hsluv.Hsluv.maxChromaForLH = function(L,H) {
	var hrad = H / 360 * Math.PI * 2;
	var bounds = hsluv.Hsluv.getBounds(L);
	var min = Infinity;
	var _g = 0;
	while(_g < bounds.length) {
		var bound = bounds[_g];
		++_g;
		var length = hsluv.Geometry.lengthOfRayUntilIntersect(hrad,bound);
		if(length >= 0) {
			min = Math.min(min,length);
		}
	}
	return min;
};
hsluv.Hsluv.dotProduct = function(a,b) {
	var sum = 0;
	var _g1 = 0;
	var _g = a.length;
	while(_g1 < _g) {
		var i = _g1++;
		sum += a[i] * b[i];
	}
	return sum;
};
hsluv.Hsluv.fromLinear = function(c) {
	if(c <= 0.0031308) {
		return 12.92 * c;
	} else {
		return 1.055 * Math.pow(c,0.416666666666666685) - 0.055;
	}
};
hsluv.Hsluv.toLinear = function(c) {
	if(c > 0.04045) {
		return Math.pow((c + 0.055) / 1.055,2.4);
	} else {
		return c / 12.92;
	}
};
hsluv.Hsluv.xyzToRgb = function(tuple) {
	return [hsluv.Hsluv.fromLinear(hsluv.Hsluv.dotProduct(hsluv.Hsluv.m[0],tuple)),hsluv.Hsluv.fromLinear(hsluv.Hsluv.dotProduct(hsluv.Hsluv.m[1],tuple)),hsluv.Hsluv.fromLinear(hsluv.Hsluv.dotProduct(hsluv.Hsluv.m[2],tuple))];
};
hsluv.Hsluv.rgbToXyz = function(tuple) {
	var rgbl = [hsluv.Hsluv.toLinear(tuple[0]),hsluv.Hsluv.toLinear(tuple[1]),hsluv.Hsluv.toLinear(tuple[2])];
	return [hsluv.Hsluv.dotProduct(hsluv.Hsluv.minv[0],rgbl),hsluv.Hsluv.dotProduct(hsluv.Hsluv.minv[1],rgbl),hsluv.Hsluv.dotProduct(hsluv.Hsluv.minv[2],rgbl)];
};
hsluv.Hsluv.yToL = function(Y) {
	if(Y <= hsluv.Hsluv.epsilon) {
		return Y / hsluv.Hsluv.refY * hsluv.Hsluv.kappa;
	} else {
		return 116 * Math.pow(Y / hsluv.Hsluv.refY,0.333333333333333315) - 16;
	}
};
hsluv.Hsluv.lToY = function(L) {
	if(L <= 8) {
		return hsluv.Hsluv.refY * L / hsluv.Hsluv.kappa;
	} else {
		return hsluv.Hsluv.refY * Math.pow((L + 16) / 116,3);
	}
};
hsluv.Hsluv.xyzToLuv = function(tuple) {
	var X = tuple[0];
	var Y = tuple[1];
	var Z = tuple[2];
	var divider = X + 15 * Y + 3 * Z;
	var varU = 4 * X;
	var varV = 9 * Y;
	if(divider != 0) {
		varU /= divider;
		varV /= divider;
	} else {
		varU = NaN;
		varV = NaN;
	}
	var L = hsluv.Hsluv.yToL(Y);
	if(L == 0) {
		return [0,0,0];
	}
	var U = 13 * L * (varU - hsluv.Hsluv.refU);
	var V = 13 * L * (varV - hsluv.Hsluv.refV);
	return [L,U,V];
};
hsluv.Hsluv.luvToXyz = function(tuple) {
	var L = tuple[0];
	var U = tuple[1];
	var V = tuple[2];
	if(L == 0) {
		return [0,0,0];
	}
	var varU = U / (13 * L) + hsluv.Hsluv.refU;
	var varV = V / (13 * L) + hsluv.Hsluv.refV;
	var Y = hsluv.Hsluv.lToY(L);
	var X = 0 - 9 * Y * varU / ((varU - 4) * varV - varU * varV);
	var Z = (9 * Y - 15 * varV * Y - varV * X) / (3 * varV);
	return [X,Y,Z];
};
hsluv.Hsluv.luvToLch = function(tuple) {
	var L = tuple[0];
	var U = tuple[1];
	var V = tuple[2];
	var C = Math.sqrt(U * U + V * V);
	var H;
	if(C < 0.00000001) {
		H = 0;
	} else {
		var Hrad = Math.atan2(V,U);
		H = Hrad * 180.0 / Math.PI;
		if(H < 0) {
			H = 360 + H;
		}
	}
	return [L,C,H];
};
hsluv.Hsluv.lchToLuv = function(tuple) {
	var L = tuple[0];
	var C = tuple[1];
	var H = tuple[2];
	var Hrad = H / 360.0 * 2 * Math.PI;
	var U = Math.cos(Hrad) * C;
	var V = Math.sin(Hrad) * C;
	return [L,U,V];
};
hsluv.Hsluv.hsluvToLch = function(tuple) {
	var H = tuple[0];
	var S = tuple[1];
	var L = tuple[2];
	if(L > 99.9999999) {
		return [100,0,H];
	}
	if(L < 0.00000001) {
		return [0,0,H];
	}
	var max = hsluv.Hsluv.maxChromaForLH(L,H);
	var C = max / 100 * S;
	return [L,C,H];
};
hsluv.Hsluv.lchToHsluv = function(tuple) {
	var L = tuple[0];
	var C = tuple[1];
	var H = tuple[2];
	if(L > 99.9999999) {
		return [H,0,100];
	}
	if(L < 0.00000001) {
		return [H,0,0];
	}
	var max = hsluv.Hsluv.maxChromaForLH(L,H);
	var S = C / max * 100;
	return [H,S,L];
};
hsluv.Hsluv.hpluvToLch = function(tuple) {
	var H = tuple[0];
	var S = tuple[1];
	var L = tuple[2];
	if(L > 99.9999999) {
		return [100,0,H];
	}
	if(L < 0.00000001) {
		return [0,0,H];
	}
	var max = hsluv.Hsluv.maxSafeChromaForL(L);
	var C = max / 100 * S;
	return [L,C,H];
};
hsluv.Hsluv.lchToHpluv = function(tuple) {
	var L = tuple[0];
	var C = tuple[1];
	var H = tuple[2];
	if(L > 99.9999999) {
		return [H,0,100];
	}
	if(L < 0.00000001) {
		return [H,0,0];
	}
	var max = hsluv.Hsluv.maxSafeChromaForL(L);
	var S = C / max * 100;
	return [H,S,L];
};
hsluv.Hsluv.rgbToHex = function(tuple) {
	var h = "#";
	var _g = 0;
	while(_g < 3) {
		var i = _g++;
		var chan = tuple[i];
		var c = Math.round(chan * 255);
		var digit2 = c % 16;
		var digit1 = (c - digit2) / 16 | 0;
		h += hsluv.Hsluv.hexChars.charAt(digit1) + hsluv.Hsluv.hexChars.charAt(digit2);
	}
	return h;
};
hsluv.Hsluv.hexToRgb = function(hex) {
	hex = hex.toLowerCase();
	var ret = [];
	var _g = 0;
	while(_g < 3) {
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
hsluv.Hsluv.m = [[3.240969941904521,-1.537383177570093,-0.498610760293],[-0.96924363628087,1.87596750150772,0.041555057407175],[0.055630079696993,-0.20397695888897,1.056971514242878]];
hsluv.Hsluv.minv = [[0.41239079926595,0.35758433938387,0.18048078840183],[0.21263900587151,0.71516867876775,0.072192315360733],[0.019330818715591,0.11919477979462,0.95053215224966]];
hsluv.Hsluv.refY = 1.0;
hsluv.Hsluv.refU = 0.19783000664283;
hsluv.Hsluv.refV = 0.46831999493879;
hsluv.Hsluv.kappa = 903.2962962;
hsluv.Hsluv.epsilon = 0.0088564516;
hsluv.Hsluv.hexChars = "0123456789abcdef";
var root = {
    "hsluvToRgb": hsluv.Hsluv.hsluvToRgb,
    "rgbToHsluv": hsluv.Hsluv.rgbToHsluv,
    "hpluvToRgb": hsluv.Hsluv.hpluvToRgb,
    "rgbToHpluv": hsluv.Hsluv.rgbToHpluv,
    "hsluvToHex": hsluv.Hsluv.hsluvToHex,
    "hexToHsluv": hsluv.Hsluv.hexToHsluv,
    "hpluvToHex": hsluv.Hsluv.hpluvToHex,
    "hexToHpluv": hsluv.Hsluv.hexToHpluv,
    "lchToHpluv": hsluv.Hsluv.lchToHpluv,
    "hpluvToLch": hsluv.Hsluv.hpluvToLch,
    "lchToHsluv": hsluv.Hsluv.lchToHsluv,
    "hsluvToLch": hsluv.Hsluv.hsluvToLch,
    "lchToLuv": hsluv.Hsluv.lchToLuv,
    "luvToLch": hsluv.Hsluv.luvToLch,
    "xyzToLuv": hsluv.Hsluv.xyzToLuv,
    "luvToXyz": hsluv.Hsluv.luvToXyz,
    "xyzToRgb": hsluv.Hsluv.xyzToRgb,
    "rgbToXyz": hsluv.Hsluv.rgbToXyz,
    "lchToRgb": hsluv.Hsluv.lchToRgb,
    "rgbToLch": hsluv.Hsluv.rgbToLch
};

var hsluv_1 = root;

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

var _extends = Object.assign || function (target) {
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

var slicedToArray = function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
}();

var toConsumableArray = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  } else {
    return Array.from(arr);
  }
};

// 

var HSLuvColor = function () {
  function HSLuvColor(channels) {
    classCallCheck(this, HSLuvColor);

    this.channels = channels;
  }

  createClass(HSLuvColor, [{
    key: 'toString',
    value: function toString() {
      return this.channels.toString();
    }
  }, {
    key: 'toRGBColor',
    value: function toRGBColor() {
      var rgbChannels = hsluv_1.hsluvToRgb(this.channels).map(function (channel) {
        return Math.floor(channel * 255 + 0.5);
      });
      var rgbColor = new RGBColor(rgbChannels);

      return rgbColor;
    }
  }, {
    key: 'hue',
    get: function get$$1() {
      return this.channels[HUE_CHANNEL_INDEX];
    }
  }, {
    key: 'saturation',
    get: function get$$1() {
      return this.channels[SATURATION_CHANNEL_INDEX];
    }
  }, {
    key: 'lightness',
    get: function get$$1() {
      return this.channels[LIGHTNESS_CHANNEL_INDEX];
    }
  }], [{
    key: 'fromString',
    value: function fromString(colorString) {
      var channels = colorString.split(',').map(Number);
      var color = new HSLuvColor([channels[0], channels[1], channels[2]]);

      return color;
    }
  }]);
  return HSLuvColor;
}();

// Index for accessing the hue channel in an HSLuvColor object.
var HUE_CHANNEL_INDEX = 0;
// Index for accessing the saturation channel in an HSLuvColor object.
var SATURATION_CHANNEL_INDEX = 1;
// Index for accessing the lightness channel in an HSLuvColor object.
var LIGHTNESS_CHANNEL_INDEX = 2;

// 

var RGBColor = function () {
  function RGBColor(channels) {
    classCallCheck(this, RGBColor);

    this.channels = channels;
  }

  createClass(RGBColor, [{
    key: 'toHSLuvColor',
    value: function toHSLuvColor() {
      var rgbChannels = this.channels.map(function (channel) {
        return channel / 255;
      });
      var hsluvChannels = hsluv_1.rgbToHsluv(rgbChannels);
      var hsluvColor = new HSLuvColor(hsluvChannels);

      return hsluvColor;
    }
  }, {
    key: 'red',
    get: function get$$1() {
      return this.channels[RED_CHANNEL_INDEX];
    }
  }, {
    key: 'green',
    get: function get$$1() {
      return this.channels[GREEN_CHANNEL_INDEX];
    }
  }, {
    key: 'blue',
    get: function get$$1() {
      return this.channels[BLUE_CHANNEL_INDEX];
    }
  }]);
  return RGBColor;
}();

// Index for accessing the red channel in a RGBColor object.
var RED_CHANNEL_INDEX = 0;
// Index for accessing the green channel in a RGBColor object.
var GREEN_CHANNEL_INDEX = 1;
// Index for accessing the blue channel in a RGBColor object.
var BLUE_CHANNEL_INDEX = 2;

// 


function getImageData(imageElement) {
  if (imageElement instanceof HTMLImageElement) {
    return getImageDataFromHTMLImageElement(imageElement);
  }

  // imageElement is of type HTMLCanvasElement
  return getImageDataFromHTMLCanvasElement(imageElement);
}

function getImageDataFromHTMLImageElement(imageElement) {
  var canvasElement = document.createElement('canvas');
  canvasElement.width = imageElement.width;
  canvasElement.height = imageElement.height;

  var canvasContext = canvasElement.getContext('2d');
  canvasContext.drawImage(imageElement, 0, 0, imageElement.width, imageElement.height);

  return getImageDataFromHTMLCanvasElement(canvasElement);
}

function getImageDataFromHTMLCanvasElement(canvasElement) {
  var canvasContext = canvasElement.getContext('2d');
  var imageData = canvasContext.getImageData(0, 0, canvasElement.width, canvasElement.height).data;

  return imageData;
}

// 

var RGBImage = function () {
  function RGBImage(data) {
    classCallCheck(this, RGBImage);

    this.data = data;
  }

  createClass(RGBImage, null, [{
    key: 'fromImageElement',
    value: function fromImageElement(imageElement, quality) {
      var rgbImageData = [];

      var rgbaImageData = getImageData(imageElement);
      var numberOfEntriesToSkip = 4 * (quality - 1);

      for (var i = numberOfEntriesToSkip; i < rgbaImageData.length; i += 4 + numberOfEntriesToSkip) {
        var rgbColor = new RGBColor([rgbaImageData[i + RED_CHANNEL_INDEX], rgbaImageData[i + GREEN_CHANNEL_INDEX], rgbaImageData[i + BLUE_CHANNEL_INDEX]]);

        rgbImageData.push(rgbColor);
      }

      return new RGBImage(rgbImageData);
    }
  }]);
  return RGBImage;
}();

// 

// Used for configuring a color quantization algorithm.


// Used for configuring a color quantization algorithm from an Image object.


// Used for configuring a color quantization algorithm from an ImageElement object.


// QuantizationParameters object in which the properties have already been validated.


// RGBImageConfiguration object in which the properties have already been validated.


// ImageElementConfiguration in which the properties have already been validated.


// The highest quality for image data extraction.
var HIGHEST_QUALITY = 1;
// The lowest quality for image data extraction, only parses every twenty-fifth pixel.
var LOWEST_QUALITY = 25;

// The lower the value, the higher the image quality, the longer the execution time.

var Quality = function () {
  function Quality(highest, lowest) {
    classCallCheck(this, Quality);

    this.highest = highest;
    this.lowest = lowest;
  }

  createClass(Quality, [{
    key: 'toString',
    value: function toString() {
      return '[' + this.highest + ', ' + this.lowest + ']';
    }
  }]);
  return Quality;
}();

// Defines an interval of valid quality values.


var VALID_QUALITIES = new Quality(HIGHEST_QUALITY, LOWEST_QUALITY);

// Default number of colors for a color quantization algorithm.
var DEFAULT_NUMBER_OF_COLORS = 8;
// Default quality for a color quantization algorithm.
var DEFAULT_QUALITY = HIGHEST_QUALITY;

// 

function validateParameters(parameters) {
  if (!parameters.rgbImage && !parameters.imageElement) {
    return new RangeError('parameters should include either rgbImage or imageElement property');
  }

  if (parameters.rgbImage) {
    return validateRGBImageConfiguration(parameters);
  }

  // parameters is of type ImageElementConfiguration
  return validateImageElementConfiguration(parameters);
}

function validateRGBImageConfiguration(parameters) {
  var rgbImage = parameters.rgbImage;


  if (!(rgbImage instanceof RGBImage)) {
    return new TypeError('image should be of type RGBImage');
  }

  return validateBaseConfiguration(parameters);
}

function validateImageElementConfiguration(parameters) {
  var imageElement = parameters.imageElement;


  if (!(imageElement instanceof HTMLImageElement) && !(imageElement instanceof HTMLCanvasElement)) {
    return new TypeError('imageElement should be of type HTMLImageElement or HTMLCanvasElement');
  }

  return validateBaseConfiguration(parameters);
}

function validateBaseConfiguration(parameters) {
  var _parameters$numberOfC = parameters.numberOfColors,
      numberOfColors = _parameters$numberOfC === undefined ? DEFAULT_NUMBER_OF_COLORS : _parameters$numberOfC,
      _parameters$quality = parameters.quality,
      quality = _parameters$quality === undefined ? DEFAULT_QUALITY : _parameters$quality;


  if (!Number.isInteger(numberOfColors)) {
    return new TypeError('numberOfColors should be an integer');
  }
  if (!(numberOfColors >= 1 && numberOfColors <= 256)) {
    return new RangeError('numberOfColors should lie in [1, 256]');
  }

  if (!Number.isInteger(quality)) {
    return new TypeError('quality should be an integer');
  }
  if (!(quality >= VALID_QUALITIES.highest && quality <= VALID_QUALITIES.lowest)) {
    return new RangeError('quality should lie in ' + VALID_QUALITIES.toString());
  }

  if (parameters.rgbImage) {
    return { rgbImage: parameters.rgbImage, numberOfColors: numberOfColors, quality: quality };
  }

  // parameters is of type ImageElementConfiguration
  return { imageElement: parameters.imageElement, numberOfColors: numberOfColors, quality: quality };
}

// 

// Maps each color in the image to its representative color.


// A histogram of the most dominant colors in a image.


// A bounded region in the original source image.


// Enum for safely accessing a channel in a RGBColor object.


function quantize(parameters) {
  return runMedianCut(parameters, buildInverseColorMap);
}

function reduce(parameters) {
  return runMedianCut(parameters, buildColorPalette);
}

function runMedianCut(parameters, buildMap) {
  var validatedParameters = validateParameters(parameters);
  if (validatedParameters instanceof Error) {
    return validatedParameters;
  }

  var rgbImage = extractRGBImage(validatedParameters);
  var vboxes = findMostDominantColors(rgbImage, validatedParameters.numberOfColors);
  var resultingMap = buildMap(vboxes);

  return resultingMap;
}

function extractRGBImage(parameters) {
  return parameters.rgbImage ? parameters.rgbImage : RGBImage.fromImageElement(parameters.imageElement, parameters.quality);
}

function findMostDominantColors(image, numberOfColors) {
  var vboxes = [image.data];

  for (var i = 0; i < numberOfColors - 1; i += 1) {
    var largestVbox = findLargestVbox(vboxes);
    var longestAxis = findLongestAxis(largestVbox);
    var splittedVboxes = splitAlongAxis(largestVbox, longestAxis);

    vboxes.splice(vboxes.indexOf(largestVbox), 1);
    vboxes = vboxes.concat(splittedVboxes);
  }

  return vboxes;
}

function findLargestVbox(vboxes) {
  return vboxes.reduce(function (previous, current) {
    return current.length > previous.length ? current : previous;
  });
}

function findLongestAxis(vbox) {
  var RGBColorAxis = function () {
    function RGBColorAxis(axis) {
      classCallCheck(this, RGBColorAxis);

      this.axis = axis;
      this.minMax = [255, 0];
    }

    createClass(RGBColorAxis, [{
      key: 'updateMinMax',
      value: function updateMinMax(value) {
        this.minMax = [Math.min(value, this.minMax[0]), Math.max(value, this.minMax[1])];
      }
    }, {
      key: 'width',
      get: function get$$1() {
        return this.minMax[1] - this.minMax[0];
      }
    }]);
    return RGBColorAxis;
  }();

  var rgbColorAxes = [new RGBColorAxis(RED_CHANNEL_INDEX), new RGBColorAxis(GREEN_CHANNEL_INDEX), new RGBColorAxis(BLUE_CHANNEL_INDEX)];

  vbox.forEach(function (color) {
    rgbColorAxes[RED_CHANNEL_INDEX].updateMinMax(color.red);
    rgbColorAxes[GREEN_CHANNEL_INDEX].updateMinMax(color.green);
    rgbColorAxes[BLUE_CHANNEL_INDEX].updateMinMax(color.blue);
  });

  var longestAxis = rgbColorAxes.reduce(function (previous, current) {
    return current.width > previous.width ? current : previous;
  });

  return longestAxis.axis;
}

function splitAlongAxis(vbox, axis) {
  var median = findAxisMedian(vbox, axis);
  var vboxes = splitOnAxisMedian(vbox, axis, median);

  return vboxes;
}

function findAxisMedian(vbox, axis) {
  var extractedChannelValues = vbox.map(function (color) {
    return color.channels[axis];
  }).sort(function (previous, current) {
    return previous - current;
  });
  var median = extractedChannelValues[Math.floor(extractedChannelValues.length / 2) - 1];

  return median;
}

function splitOnAxisMedian(vbox, axis, median) {
  var groupByAxisMedian = function groupByAxisMedian(color) {
    return color.channels[axis] <= median ? 0 : 1;
  };
  var vboxes = vbox.reduce(function (accumulator, color) {
    accumulator[groupByAxisMedian(color)].push(color);
    return accumulator;
  }, [[], []]);

  return vboxes;
}

function buildInverseColorMap(vboxes) {
  var _ref;

  var inverseColorMap = vboxes.map(function (vbox) {
    var representativeColor = findRepresentativeColor(vbox);
    return vbox.map(function (color) {
      return {
        sourceColor: color,
        representativeColor: representativeColor
      };
    });
  });

  return (_ref = []).concat.apply(_ref, toConsumableArray(inverseColorMap));
}

function buildColorPalette(vboxes) {
  return vboxes.map(function (vbox) {
    return {
      color: findRepresentativeColor(vbox),
      population: vbox.length
    };
  });
}

function findRepresentativeColor(vbox) {
  var colorSum = vbox.reduce(function (accumulator, color) {
    return [accumulator[RED_CHANNEL_INDEX] + color.red, accumulator[GREEN_CHANNEL_INDEX] + color.green, accumulator[BLUE_CHANNEL_INDEX] + color.blue];
  }, [0, 0, 0]);
  var colorAverage = colorSum.map(function (channelSum) {
    return Math.floor(channelSum / vbox.length + 0.5);
  });

  return new RGBColor([colorAverage[RED_CHANNEL_INDEX], colorAverage[GREEN_CHANNEL_INDEX], colorAverage[BLUE_CHANNEL_INDEX]]);
}

// 

var HSLuvImage = function () {
  function HSLuvImage(data) {
    classCallCheck(this, HSLuvImage);

    this.data = data;
  }

  createClass(HSLuvImage, null, [{
    key: 'fromRGBImage',
    value: function fromRGBImage(rgbImage, quality) {
      var hsluvImageData = [];

      var numberOfPixelsToSkip = quality - 1;

      for (var i = numberOfPixelsToSkip; i < rgbImage.data.length; i += 1 + numberOfPixelsToSkip) {
        var rgbChannels = [rgbImage.data[i].red, rgbImage.data[i].green, rgbImage.data[i].blue];
        var rgbColor = new RGBColor(rgbChannels);
        var hsluvColor = rgbColor.toHSLuvColor();

        hsluvImageData.push(hsluvColor);
      }

      return new HSLuvImage(hsluvImageData);
    }
  }, {
    key: 'fromImageElement',
    value: function fromImageElement(imageElement, quality) {
      var hsluvImageData = [];

      var rgbaImageData = getImageData(imageElement);
      var numberOfEntriesToSkip = 4 * (quality - 1);

      for (var i = numberOfEntriesToSkip; i < rgbaImageData.length; i += 4 + numberOfEntriesToSkip) {
        var rgbChannels = [rgbaImageData[i + RED_CHANNEL_INDEX], rgbaImageData[i + GREEN_CHANNEL_INDEX], rgbaImageData[i + BLUE_CHANNEL_INDEX]];
        var rgbColor = new RGBColor(rgbChannels);
        var hsluvColor = rgbColor.toHSLuvColor();

        hsluvImageData.push(hsluvColor);
      }

      return new HSLuvImage(hsluvImageData);
    }
  }]);
  return HSLuvImage;
}();

// 


// Used for configuring the popularity algorithm.


// Used for configuring the popularity algorithm from an Image object.


// Used for configuring the popularity algorithm from an ImageElement object.


// PopularityParameters object in which the properties have already been validated.


// RGBImageConfiguration object in which the properties have already been validated.


// ImageElementConfiguration object in which the properties have already been validated.


// Defines the region size in terms of the interval lengths for each of the channels in an HSLuvColor object.


// Defines the default region size dimensions for the popularity algorithm.
var DEFAULT_REGION_SIZE = [15, 20, 20];

// 

function validateParameters$1(parameters) {
  var _parameters$regionSiz = parameters.regionSize,
      regionSize = _parameters$regionSiz === undefined ? DEFAULT_REGION_SIZE : _parameters$regionSiz;

  var _regionSize = slicedToArray(regionSize, 3),
      hue = _regionSize[0],
      saturation = _regionSize[1],
      lightness = _regionSize[2];

  if (regionSize.length !== 3) {
    return RangeError('regionSize should be of type [number, number, number]');
  }

  if (!Number.isInteger(hue)) {
    return TypeError('hue in regionSize should be an integer');
  }
  if (!(hue >= 1 && hue <= 360)) {
    return RangeError('hue in regionSize should lie in [1, 360]');
  }

  if (!Number.isInteger(saturation)) {
    return TypeError('saturation in regionSize should be an integer');
  }
  if (!(saturation >= 1 && saturation <= 100)) {
    return RangeError('saturation in regionSize should lie in [1, 100]');
  }

  if (!Number.isInteger(lightness)) {
    return TypeError('lightness in regionSize should be an integer');
  }
  if (!(lightness >= 1 && lightness <= 100)) {
    return RangeError('lightness in regionSize should lie in [1, 100]');
  }

  var validatedBaseParameters = validateBaseParameters(parameters);
  if (validatedBaseParameters instanceof Error) {
    return validatedBaseParameters;
  }

  return _extends({}, validatedBaseParameters, {
    regionSize: regionSize
  });
}

function validateBaseParameters(parameters) {
  if (parameters.rgbImage) {
    var rgbImage = parameters.rgbImage,
        _numberOfColors = parameters.numberOfColors,
        _quality = parameters.quality;

    return validateParameters({ rgbImage: rgbImage, numberOfColors: _numberOfColors, quality: _quality });
  }

  // parameters is of type ImageElementConfiguration
  var imageElement = parameters.imageElement,
      numberOfColors = parameters.numberOfColors,
      quality = parameters.quality;

  return validateParameters({ imageElement: imageElement, numberOfColors: numberOfColors, quality: quality });
}

// 

function mapColorToRegionID(color, regionSize) {
  var hueIntervals = [];
  for (var i = 0; i < 360 + regionSize[HUE_CHANNEL_INDEX]; i += regionSize[HUE_CHANNEL_INDEX]) {
    hueIntervals.push(Math.min(i, 360));
  }

  var saturationIntervals = [];
  for (var _i = 0; _i < 100 + regionSize[SATURATION_CHANNEL_INDEX]; _i += regionSize[SATURATION_CHANNEL_INDEX]) {
    saturationIntervals.push(Math.min(_i, 100));
  }

  var lightnessIntervals = [];
  for (var _i2 = 0; _i2 < 100 + regionSize[LIGHTNESS_CHANNEL_INDEX]; _i2 += regionSize[LIGHTNESS_CHANNEL_INDEX]) {
    lightnessIntervals.push(Math.min(_i2, 100));
  }

  return [mapChannelToRegionID(hueIntervals, color.hue), mapChannelToRegionID(saturationIntervals, color.saturation), mapChannelToRegionID(lightnessIntervals, color.lightness)].join(',');
}

// The return value should be interpreted as a half-open interval [begin, end) of color values.
function mapChannelToRegionID(intervals, channel) {
  var i = 0;
  while (channel >= intervals[i] && i < intervals.length) {
    i += 1;
  }

  return [intervals[i - 1], intervals[i]].toString();
}

// 

// A histogram of the most dominant colors in a image.


// Maps a color to the number of pixels with that specific color.


// Maps each region to its color histogram.


// Maps a color to the number of pixels with that specific color within a specific region.


function popularize(parameters) {
  var validatedParameters = validateParameters$1(parameters);
  if (validatedParameters instanceof Error) {
    return validatedParameters;
  }

  var hsluvImage = extractHSLuvImage(validatedParameters);
  var colorPalette = buildColorPalette$1(hsluvImage, validatedParameters.regionSize, validatedParameters.numberOfColors);

  return colorPalette;
}

function extractHSLuvImage(parameters) {
  return parameters.rgbImage ? HSLuvImage.fromRGBImage(parameters.rgbImage, parameters.quality) : HSLuvImage.fromImageElement(parameters.imageElement, parameters.quality);
}

function buildColorPalette$1(image, regionSize, numberOfColors) {
  var histogram = buildHistogram(image, regionSize);
  var colorPalette = findMostDominantColors$1(histogram, numberOfColors);

  return colorPalette;
}

function buildHistogram(image, regionSize) {
  var histogram = new Map();

  image.data.forEach(function (color) {
    var regionID = mapColorToRegionID(color, regionSize);
    var colorID = color.toString();
    var regionHistogram = histogram.get(regionID);

    if (!regionHistogram) {
      histogram.set(regionID, new Map([[colorID, 1]]));
    } else {
      var colorPopulation = regionHistogram.get(colorID);
      if (!colorPopulation) {
        regionHistogram.set(colorID, 1);
      } else {
        regionHistogram.set(colorID, colorPopulation + 1);
      }
    }
  });

  return Array.from(histogram.entries()).map(function (region) {
    return [region[0], Array.from(region[1].entries()).map(function (color) {
      return [color[0], color[1]];
    })];
  });
}

function findMostDominantColors$1(histogram, numberOfColors) {
  var mostDominantRegions = findMostDominantRegions(histogram, numberOfColors);
  var mostDominantColors = mostDominantRegions.map(function (region) {
    return findMostDominantColor(region[1]);
  });

  return mostDominantColors;
}

function findMostDominantRegions(histogram, numberOfColors) {
  var regions = histogram.map(function (region) {
    return {
      regionID: region[0],
      population: getRegionPopulation(region[1])
    };
  });
  regions.sort(function (previous, current) {
    return current.population - previous.population;
  });

  var mostDominantRegionIDs = regions.slice(0, numberOfColors).map(function (region) {
    return region.regionID;
  });
  var mostDominantRegions = histogram.filter(function (region) {
    return mostDominantRegionIDs.includes(region[0]);
  });

  return mostDominantRegions;
}

function findMostDominantColor(histogram) {
  var mostDominantColorEntry = histogram.map(function (color) {
    return {
      color: HSLuvColor.fromString(color[0]),
      population: color[1]
    };
  }).reduce(function (previous, current) {
    return current.population > previous.population ? current : previous;
  });

  return {
    color: mostDominantColorEntry.color.toRGBColor(),
    population: getRegionPopulation(histogram)
  };
}

function getRegionPopulation(histogram) {
  return histogram.reduce(function (accumulator, color) {
    return accumulator + color[1];
  }, 0);
}

// 

var ColorQuantization = {
  quantize: quantize,
  reduce: reduce,
  popularize: popularize
};

// 

var index = _extends({}, ColorQuantization, {
  RGBImage: RGBImage
});

module.exports = index;
