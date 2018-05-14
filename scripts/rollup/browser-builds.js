import path from 'path';

import { version } from '../../packages/truesight/package.json';

const CJS_BUILD = 'cjs';
const ESM_BUILD = 'esm';
const UMD_DEVELOPMENT_BUILD = 'umd';
const UMD_PRODUCTION_BUILD = 'umd-prod';

const root = path.resolve('packages/truesight');
const input = path.join(root, 'src/index.js');
const output = {
  directory: path.join(root, 'dist'),
  version,
};

const TRUESIGHT_BUNDLE_NAME = 'truesight';

const browserBuilds = {
  [CJS_BUILD]: {
    root,
    input,
    output: Object.assign(
      {
        file: `${TRUESIGHT_BUNDLE_NAME}.common.js`,
        format: 'cjs',
        uglify: false,
      },
      output
    ),
  },
  [ESM_BUILD]: {
    root,
    input,
    output: Object.assign(
      {
        file: `${TRUESIGHT_BUNDLE_NAME}.esm.js`,
        format: 'es',
        uglify: false,
      },
      output
    ),
  },
  [UMD_DEVELOPMENT_BUILD]: {
    root,
    input,
    output: Object.assign(
      {
        file: `${TRUESIGHT_BUNDLE_NAME}.js`,
        format: 'umd',
        uglify: false,
      },
      output
    ),
  },
  [UMD_PRODUCTION_BUILD]: {
    root,
    input,
    output: Object.assign(
      {
        file: `${TRUESIGHT_BUNDLE_NAME}.min.js`,
        format: 'umd',
        uglify: true,
      },
      output
    ),
  },
};

export default browserBuilds;
