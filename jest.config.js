/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './app/backend/tsconfig.test.json'
    }]
  },
  moduleNameMapper: {
    "^@shared/(.*)$": "<rootDir>/app/shared/$1"
  },
  testMatch: [
    '**/__tests__/**/*.test.ts',
    '**/__tests__/**/*.spec.ts',
  ]
};