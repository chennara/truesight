// @flow

export type ColorPalette = {|
  color: RGBColor,
  population: number,
|}[];

export type RGBColor = {|
  channels: [number, number, number],
  red: number,
  green: number,
  blue: number,
|};
