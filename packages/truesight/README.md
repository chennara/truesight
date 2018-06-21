# truesight

[![truesight-version](https://badge.fury.io/js/truesight.svg)](https://badge.fury.io/js/truesight) [![truesight-build-status](https://travis-ci.org/chennara/truesight.svg?branch=master)](https://travis-ci.org/chennara/truesight) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A lightweight JavaScript library visualizing color in storytelling. A set of easy to use functions is provided for generating the inverse color maps and color palettes in both images and videos.

## Why?

The truesight [website](https://chennara.github.io/truesight/) demonstrates how you could use the library in the browser. It tries to show how a well-chosen color palette evokes mood and sets the tone in storytelling.

## Install

Install the truesight package from npm:

```bash
yarn install truesight
```

## Usage

Use the desired functions and utility classes as follows:

```javascript
import truesight from 'truesight';

truesight.popularizeImage(parameters);

new truesight.RGBImage(colors);
```

## API

In this section, [Flow](https://flow.org/) type annotations are used to denote the types for both the input and output parameters. If you're not sure how to interpret a specific type annotation, the documentation at [https://flow.org/en/docs/types/](https://flow.org/en/docs/types/) might help you (or confuse you even more).

An error will be thrown if the input parameters object does not contain the expected properties.

Due to the asynchronous nature of image loading and video stream parsing, the API is designed to be Promise-aware. Each return value will be wrapped in a `Promise` object holding the final result.

### Image

The image quantization API consists of following three functions:

* `quantizeImage` maps each color in the image to its representative color using the [median cut algorithm](https://en.wikipedia.org/wiki/Median_cut). It returns a collection of objects containing the `sourceColor: RGBColor` and `representativeColor: RGBColor` properties. The color values in a `RGBColor` object are found in the `channels` property, or `red`, `green` and `blue` properties.
* `reduceImage` extracts the most dominant colors using the same median cut implementation as before. It returns a collection of objects containing the `color: RGBColor` and `population: number` properties (or a histogram of the most dominant colors).
* `popularizeImage` on the other hand, extracts the most dominant colors using the [popularity algorithm](https://web.cs.wpi.edu/~matt/courses/cs563/talks/color_quant/CQindex.html). It returns the same collection type of color palette entries as the `reduceImage` function does.

All three functions expect a parameters object containing the `imageElement: HTMLImageElement | HTMLCanvasElement | RGBImage` property. Note that in Flow, the vertical bar `|` is used to denote the [union type](https://flow.org/en/docs/types/unions/). The `RGBImage` type might come in handy, when you're working with custom image types.

You can tweak the underlying quantization algorithm by using the `numberOfColors` and `quality` properties. By doing so, you change the number of target colors to use and number of pixels to skip respectively. The default value for `numberOfColors` is 8, while the default value for `quality` is 1. Consider setting the `quality` property to a higher value, if image quantization is taking too long.

#### Example

Say you have the following `HTMLImageElement` somewhere in an HTML document:

```html
<img id="2001-a-space-odyssey" src="2001-a-space-odyssey_1968.jpg" width="67.5" height="100">
```

You then parse the inverse color map for that image like so:

```javascript
import truesight from 'truesight';

async function foo() {
  const inverseColorMap = await truesight.quantizeImage({
    imageElement: document.querySelector('#2001-a-space-odyssey'),
    numberOfColors: 10,
    quality: 3,
  });

  for (const { sourceColor, representativeColor } of inverseColorMap) {
    blur(sourceColor, representativeColor);
  }
}
```

### Video

The video quantization functions `quantizeVideo`, `reduceVideo` and `popularizeVideo` are implemented by running the name-fellow image quantization functions on each frame. They return an asynchronous stream of color maps. If you're new to asynchronous iteration, the [Asynchronous iteration](http://exploringjs.com/es2018-es2019/ch_asynchronous-iteration.html) chapter in [Exploring ES2018 and ES2019](http://exploringjs.com/es2018-es2019/index.html) might be worth a read.

Each of the video quantization functions expects a parameters object containing the `videoElement: HTMLVideoElement` property. In addition to the image quantization properties mentioned before, you can alter the seconds between frames parsed by setting the `secondsBetweenFrames: number` property. By default, this value is 1 second.

A result object in the stream contains the `index`, `timestamp` and `result` properties. The `index` property starts at 0 and denotes the index in the stream for the parsed frame, while the `timestamp` property denotes the video timestamp in milliseconds. Lastly, the `result` property simply holds the result of image quantization.

#### Example

Say you have the following `HTMLVideoElement` showing the new [Incredibles 2](https://www.youtube.com/watch?v=i5qOzqD9Rms) trailer:

```html
<video id="incredibles-2" src="incredibles-2_2018.mp4" width="1280" height="545"></video>
```

You then await the color palette for every parsed frame as follows:

```javascript
import truesight from 'truesight';

async function bar() {
  const colorPaletteStream = await truesight.popularizeVideo({
    videoElement: document.querySelector('#incredibles-2'),
    secondsBetweenFrames: 3,
    numberOfColors: 7,
    quality: 15,
  });

  for await (const { index, timestamp, result } of colorPaletteStream) {
    colorize(index, timestamp, result);
  }
}
```
