module.exports = {
  plugins: ['flowtype'],
  extends: ['airbnb-base', 'plugin:flowtype/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    parser: 'babel-eslint',
    ecmaVersion: 2017,
    sourceType: 'module',
  },
  rules: {
    // Following Airbnb settings are found to be too restrictive:
    // - Module resolution will already handled by Flow.
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    // - Following rule doesn't apply to 'var' declarations, since they are disallowed.
    'no-use-before-define': 'off',

    // Override default Flow settings:
    'flowtype/require-parameter-type': ['error', { excludeArrowFunctions: true }],
    'flowtype/require-return-type': ['error', 'always', { excludeArrowFunctions: true }],
  },
  settings: {
    flowtype: {
      onlyFilesWithFlowAnnotation: true,
    },
  },
  env: {
    browser: true,
  },
};
