import { Config } from 'jest'

const lintConfig: Config = {
  // Root
  rootDir: '.',

  // Project config
  displayName: 'lint',
  runner: 'jest-runner-eslint',

  // Note: Make sure we keep this in sync w/ the match patterns provided by NextJS
  testMatch: ['<rootDir>/app/**/src/**/*.(js|ts|jsx|tsx)'],

  testPathIgnorePatterns: ['node_modules', 'dist'],
}

export default lintConfig
