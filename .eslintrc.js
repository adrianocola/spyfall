module.exports = {
  root: true,
  extends: '@ensemblebr/eslint-config',
  settings: {
    'import/resolver': {
      node: {},
      webpack: {
        config: './config/webpack.prod.babel.js',
      },
    },
  },
  rules: {
    'jsx-a11y/anchor-is-valid': 'off',
  },
};
