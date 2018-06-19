import path from 'path';

import { version } from '../../packages/truesight/package.json';

const TRUESIGHT_SERVER_BUNDLE_NAME = 'truesight-server';

const SERVER_CJS_BUILD = 'server-cjs';
const SERVER_ESM_BUILD = 'server-esm';

const root = path.resolve('packages/truesight-server');

const baseEntry = {
  root,
  input: path.join(root, 'index.js'),
};

const outputEntry = {
  directory: path.join(root, 'dist'),
  version,
};

const serverBuilds = {
  [SERVER_CJS_BUILD]: {
    ...baseEntry,
    output: {
      ...outputEntry,
      file: `${TRUESIGHT_SERVER_BUNDLE_NAME}.common.js`,
      format: 'cjs',
      uglify: false,
    },
  },
  [SERVER_ESM_BUILD]: {
    ...baseEntry,
    output: {
      ...outputEntry,
      file: `${TRUESIGHT_SERVER_BUNDLE_NAME}.esm.js`,
      format: 'es',
      uglify: false,
    },
  },
};

export default serverBuilds;
