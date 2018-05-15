import path from 'path';

import resolveNodeModules from 'rollup-plugin-node-resolve';
import cjsToESM from 'rollup-plugin-commonjs';
import includePaths from 'rollup-plugin-includepaths';
import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import prettier from 'rollup-plugin-prettier';
import uglify from 'rollup-plugin-uglify';

import browserBuilds from './browser-builds';
import serverBuilds from './server-builds';

const builds = {
  ...browserBuilds,
  ...serverBuilds,
};

function generateBuildConfiguration(target) {
  let build;

  if (target && target in builds) {
    build = builds[target];
  } else {
    throw new TypeError(
      `TARGET environment should be either ${Object.keys(builds)
        .map((key) => `'${key}'`)
        .join(' or ')}`
    );
  }

  const nodeModulesGlob = `${path.join(build.root, 'node_modules')}/**`;

  const config = {
    input: build.input,
    output: {
      file: path.resolve(build.output.directory, build.output.file),
      name: 'truesight',
      format: build.output.format,
      banner: `/*!
 * ${build.output.file} v${build.output.version}
 * Copyright (c) 2018-present, Chennara Nhes.
 * Released under the MIT License.
 */`,
    },
    plugins: [
      resolveNodeModules(),
      cjsToESM({
        include: nodeModulesGlob,
        sourceMap: false,
      }),
      includePaths({
        paths: [path.join(build.root, 'src')],
        extensions: ['.js'],
      }),
      babel({
        exclude: nodeModulesGlob,
      }),
    ],
  };

  if (!build.output.uglify) {
    config.plugins = config.plugins.concat([
      cleanup(),
      prettier({
        printWidth: 120,
        singleQuote: true,
        trailingComma: 'es5',
        arrowParens: 'always',
      }),
    ]);
  } else {
    config.plugins.push(
      uglify({
        output: {
          comments: '/^/*!/',
        },
      })
    );
  }

  return config;
}

const config = generateBuildConfiguration(process.env.TARGET);

export default config;
