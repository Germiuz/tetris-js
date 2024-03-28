/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    // process `*.tsx` files with `ts-jest`
    "^.+\\.tsx?$": "ts-jest"
  },
  moduleNameMapper: {
    '@app/(.*)': '<rootDir>/src/$1',
    '^.+\\.(svg|png)$': '<rootDir>/__mocks__/file.js',
    '^.+\\.(css|scss)': '<rootDir>/__mocks__/style.js',
  },
}

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
// };
