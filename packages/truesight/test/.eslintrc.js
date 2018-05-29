module.exports = {
  plugins: ['mocha'],
  rules: {
    'mocha/handle-done-callback': 'error',
    'mocha/no-global-tests': 'error',
    'mocha/no-exclusive-tests': 'error',
    'mocha/no-skipped-tests': 'error',
    'mocha/no-identical-title': 'error',
  },
  env: {
    mocha: true,
  },
  globals: {
    expect: true,
    should: true,
    sinon: true,
  },
};
