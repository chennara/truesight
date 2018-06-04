// @flow

import type { Try } from 'utils/fp/neither';

export default function hasUnknownProperties(parameters: {}, validProperties: string[]): Try<void> {
  const properties = Object.keys(parameters);
  const unknownProperties = properties.filter((property) => !validProperties.includes(property));

  if (unknownProperties.length !== 0) {
    return new RangeError(`parameters argument includes unknown property ${unknownProperties[0]}`);
  }

  return undefined;
}
