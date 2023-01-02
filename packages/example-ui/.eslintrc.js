module.exports = {
  extends: ['../../.eslintrc.js', 'react-app'],
  plugins: ['eslint-plugin-testing-library', 'plugin:react-query/recommended'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          {
            name: '@usedapp/core',
            importNames: ['useEthers'],
            message:
              'Imported useEthers from @usedapp/core.   Please import the wrapped version of useEthers from hooks/useEthers.',
          },
        ],
      },
    ],
  },
}
