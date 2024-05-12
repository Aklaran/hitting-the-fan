import { Config } from 'jest'

const config: Config = {
  // TODO: Add fine grained coverage targets as appropriate
  // Coverage
  collectCoverageFrom: [
    '<rootDir>/app/**/src/**/*.(js|ts|jsx|tsx)',
    '!**/node_modules/**',
    '!*.test.ts',
  ],
  coverageThreshold: {
    global: {},
  },

  // Jest entrypoints
  projects: ['<rootDir>/jest.lint.ts', '<rootDir>/jest.config.js'],
}

export default config
