module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    '../../.eslintrc.js',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist'],
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
