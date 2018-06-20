// @flow

import Color from 'color';

import type { ColorPalette } from 'core/types/color-palette';
import rgbToHSLuv from 'utils/color/rgb-to-hsluv';

import transformOrigin from './transform-origin';
import drawBackground from './draw-background';
import drawHueRegion from './draw-hue-region';

import type { HueRegion } from '../core/get-hue-regions';
import mapColorToHueRegion from '../core/map-color-to-hue-region';

export type DrawColorPaletteParameters = {|
  colorPalette: ColorPalette,
|};

type ColorPaletteByHue = Map<HueRegion, ColorPaletteByHueValue[]>;

type ColorPaletteByHueValue = {|
  hslColor: any,
  population: number,
|};

const BLACK_LIGHTNESS_UPPER_BOUND = 10;
const WHITE_LIGHTNESS_LOWER_BOUND = 90;

const MAX_NUMBER_OF_HUES_PER_SLICE = 3;

export default function drawColorPalette(canvasElement: HTMLCanvasElement, parameters: DrawColorPaletteParameters) {
  const { colorPalette } = parameters;

  drawBackground(canvasElement);
  drawHueRegions(canvasElement, colorPalette);
}

function drawHueRegions(canvasElement: HTMLCanvasElement, colorPalette: ColorPalette) {
  const canvasContext = canvasElement.getContext('2d');

  canvasContext.save();

  transformOrigin(canvasElement);

  const filteredColorPalette = filterColorsByLightness(colorPalette);
  const colorPaletteByHue = groupColorPaletteByHue(filteredColorPalette);

  for (const [hueRegion, hues] of colorPaletteByHue) {
    const { angleInterval } = hueRegion;

    hues.sort((hue, hue2) => hue2.population - hue.population);
    const numberOfHuesToDraw = Math.min(hues.length, MAX_NUMBER_OF_HUES_PER_SLICE);

    let r = canvasElement.width;
    const deltaR = 1 / numberOfHuesToDraw * canvasElement.width;

    for (let i = 0; i < numberOfHuesToDraw; i += 1) {
      const cssColor = hues[i].hslColor.string();
      const rInterval = [r - deltaR, r];

      drawHueRegion(canvasElement, {
        cssColor,
        angleInterval,
        rInterval,
      });

      r -= deltaR;
    }
  }

  canvasContext.restore();
}

function filterColorsByLightness(colorPalette: ColorPalette): ColorPalette {
  return colorPalette.filter((entry) => {
    const hsluvColor = rgbToHSLuv(entry.color.channels);

    return hsluvColor[2] >= BLACK_LIGHTNESS_UPPER_BOUND && hsluvColor[2] <= WHITE_LIGHTNESS_LOWER_BOUND;
  });
}

function groupColorPaletteByHue(colorPalette: ColorPalette): ColorPaletteByHue {
  const colorPaletteByHue = new Map();

  colorPalette.forEach((entry) => {
    const hslColor = Color.rgb(entry.color.channels).hsl();
    const hueRegion = mapColorToHueRegion(hslColor.color);

    const hues = colorPaletteByHue.get(hueRegion);

    const hue = {
      hslColor,
      population: entry.population,
    };

    if (!hues) {
      colorPaletteByHue.set(hueRegion, [hue]);
    } else if (hues instanceof Array) {
      hues.push(hue);
    }
  });

  return colorPaletteByHue;
}
