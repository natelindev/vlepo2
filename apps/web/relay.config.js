// relay.config.js
// @ts-check

module.exports = {
  src: `${__dirname}/src`,
  language: 'typescript',
  schema: `${__dirname}/schema/schema.graphql`,
  persistConfig: {
    file:
      process.env.ENV === 'DOCKER'
        ? './persistedQueries.json'
        : `${__dirname}/../api/src/persistedQueries.json`,
    algorithm: 'SHA256',
  },
  exclude: [
    '**/.next/**',
    '**/node_modules/**',
    '**/test/**',
    '**/schema/**',
    '**/__mocks__/**',
    '**/__generated__/**',
  ],
  customScalars: {
    DateTime: 'string',
    Upload: 'File',
    Void: 'null',
    Json: 'string',
  },
  artifactDirectory: `${__dirname}/__generated__`,
};
