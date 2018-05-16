import path from 'path';

import { version } from '../../packages/truesight/package.json';

const TRUESIGHT_BUNDLE_NAME = 'truesight';

const CJS_BUILD = 'cjs';
const ESM_BUILD = 'esm';
const UMD_DEVELOPMENT_BUILD = 'umd';
const UMD_PRODUCTION_BUILD = 'umd-prod';

const root = path.resolve('packages/truesight');

const baseEntry = {
  root,
  input: path.join(root, 'src/index.js'),
};

const outputEntry = {
  directory: path.join(root, 'dist'),
  version,
};

const browserBuilds = {
  [CJS_BUILD]: {
    ...baseEntry,
    output: {
      ...outputEntry,
      file: `${TRUESIGHT_BUNDLE_NAME}.common.js`,
      format: 'cjs',
      uglify: false,
    },
  },
  [ESM_BUILD]: {
    ...baseEntry,
    output: {
      ...outputEntry,
      file: `${TRUESIGHT_BUNDLE_NAME}.esm.js`,
      format: 'es',
      uglify: false,
    },
  },
  [UMD_DEVELOPMENT_BUILD]: {
    ...baseEntry,
    output: {
      ...outputEntry,
      file: `${TRUESIGHT_BUNDLE_NAME}.js`,
      format: 'umd',
      uglify: false,
    },
  },
  [UMD_PRODUCTION_BUILD]: {
    ...baseEntry,
    output: {
      ...outputEntry,
      file: `${TRUESIGHT_BUNDLE_NAME}.min.js`,
      format: 'umd',
      uglify: true,
    },
  },
};

export default browserBuilds;
