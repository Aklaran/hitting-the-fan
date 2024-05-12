/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',

  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/app/shared/$1"
  }
};