// @flow

export type PolarCoordinates = [number, number];

export type CartesianCoordinates = [number, number];

export default function polarToCartesian([r, theta]: PolarCoordinates): CartesianCoordinates {
  return [Math.cos(theta) * r, Math.sin(theta) * r];
}
