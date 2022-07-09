// @ts-check

/**
 * @type {import('@babel/core').TransformOptions}
 * */
module.exports = {
  presets: [
    [
      'next/babel',
      {
        'preset-env': {
          modules: false,
          targets: {
            browsers: ['>1%', 'not dead', 'not ie > 0', 'not op_mini all'],
          },
        },
      },
    ],
  ],
  plugins: [
    [
      'babel-plugin-styled-components',
      {
        topLevelImportPaths: [
          '@xstyled/styled-components',
          '@xstyled/styled-components/no-tags',
          '@xstyled/styled-components/native',
          '@xstyled/styled-components/primitives',
        ],
        ssr: true,
      },
    ],
    ['relay', { artifactDirectory: './__generated__' }],
  ],
};
