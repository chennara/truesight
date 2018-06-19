const path = require('path');

const resolveNodeModules = require('rollup-plugin-node-resolve');
const cjsToESM = require('rollup-plugin-commonjs');
const includePaths = require('rollup-plugin-includepaths');
const babel = require('rollup-plugin-babel');

const root = path.resolve('packages/truesight');
const nodeModulesGlob = `${path.join(root, 'node_modules')}/**`;

module.exports = (config) => {
  config.set({
    basePath: root,
    files: [
      {
        pattern: 'test/**/*.test.js',
        watched: false,
      },
      {
        pattern: 'test/resources/images/*.{jpg,png}',
        watched: false,
        included: false,
      },
      {
        pattern: 'test/resources/videos/*.mp4',
        watched: false,
        included: false,
      },
    ],
    preprocessors: {
      'test/**/*.test.js': ['rollup'],
    },
    rollupPreprocessor: {
      output: {
        format: 'iife',
        name: 'truesight',
      },
      plugins: [
        resolveNodeModules(),
        cjsToESM({
          include: nodeModulesGlob,
        }),
        includePaths({
          paths: [path.join(root, 'src'), path.join(root, 'test')],
          extensions: ['.js'],
        }),
        babel({
          exclude: nodeModulesGlob,
          plugins: ['istanbul'],
        }),
      ],
    },
    frameworks: ['mocha', 'chai', 'sinon'],
    reporters: ['mocha', 'coverage'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
  });
};
