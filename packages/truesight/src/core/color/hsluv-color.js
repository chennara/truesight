// @flow

export class HSLuvColor {
  channels: [number, number, number];

  constructor(channels: [number, number, number]) {
    this.channels = channels;
  }

  toString(): string {
    return this.channels.toString();
  }

  static fromString(colorString: string): HSLuvColor {
    const channels = colorString.split(',').map(Number);
    const color = new HSLuvColor([channels[0], channels[1], channels[2]]);

    return color;
  }

  get hue(): number {
    return this.channels[HUE_CHANNEL_INDEX];
  }

  get saturation(): number {
    return this.channels[SATURATION_CHANNEL_INDEX];
  }

  get lightness(): number {
    return this.channels[LIGHTNESS_CHANNEL_INDEX];
  }
}

// Index for accessing the hue channel in an HSLuvColor object.
export const HUE_CHANNEL_INDEX: 0 = 0;
// Index for accessing the saturation channel in an HSLuvColor object.
export const SATURATION_CHANNEL_INDEX: 1 = 1;
// Index for accessing the lightness channel in an HSLuvColor object.
export const LIGHTNESS_CHANNEL_INDEX: 2 = 2;
