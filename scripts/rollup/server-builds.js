import path from 'path';

import { version } from '../../packages/truesight/package.json';

const SERVER_CJS_BUILD = 'server-cjs';
const SERVER_ESM_BUILD = 'server-esm';

const root = path.resolve('packages/truesight-server');
const input = path.join(root, 'index.js');
const output = {
  directory: path.join(root, 'dist'),
  version,
};

const TRUESIGHT_SERVER_BUNDLE_NAME = 'truesight-server';

const serverBuilds = {
  [SERVER_CJS_BUILD]: {
    root,
    input,
    output: Object.assign(
      {
        file: `${TRUESIGHT_SERVER_BUNDLE_NAME}.common.js`,
        format: 'cjs',
        uglify: false,
      },
      output
    ),
  },
  [SERVER_ESM_BUILD]: {
    root,
    input,
    output: Object.assign(
      {
        file: `${TRUESIGHT_SERVER_BUNDLE_NAME}.esm.js`,
        format: 'es',
        uglify: false,
      },
      output
    ),
  },
};

export default serverBuilds;
