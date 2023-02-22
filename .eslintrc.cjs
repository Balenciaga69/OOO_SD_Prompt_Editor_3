// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:lodash/recommended', 'plugin:jsx-a11y/recommended', 'plugin:react-hooks/recommended', 'prettier'],
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended', 'plugin:lodash/recommended', 'plugin:jsx-a11y/recommended', 'plugin:react-hooks/recommended', 'plugin:promise/recommended', 'prettier'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': ['error'],
        'lodash/import-scope': [2, 'full'],
        'react/self-closing-comp': [
          'error',
          {
            component: true,
            html: true,
          },
        ],
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'lodash', 'jsx-a11y', 'react-hooks', 'promise', 'prettier'],
  settings: {
    react: {
      version: 'detect',
    },
  },
}
