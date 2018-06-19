// @flow

export class RGBColor {
  channels: [number, number, number];

  constructor(channels: [number, number, number]) {
    this.channels = channels;
  }

  get red(): number {
    return this.channels[RED_CHANNEL_INDEX];
  }

  get green(): number {
    return this.channels[GREEN_CHANNEL_INDEX];
  }

  get blue(): number {
    return this.channels[BLUE_CHANNEL_INDEX];
  }
}

// Index for accessing the red channel in a RGBColor object.
export const RED_CHANNEL_INDEX: 0 = 0;
// Index for accessing the green channel in a RGBColor object.
export const GREEN_CHANNEL_INDEX: 1 = 1;
// Index for accessing the blue channel in a RGBColor object.
export const BLUE_CHANNEL_INDEX: 2 = 2;
