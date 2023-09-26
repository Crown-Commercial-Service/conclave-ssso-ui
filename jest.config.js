module.exports = {
    preset: 'jest-preset-angular',
    roots: ['<rootDir>', 'src'],
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
    collectCoverage: true,
    coverageReporters: ['html'],
    modulePaths: ['<rootDir>', 'src'],
    moduleDirectories: [
      'node_modules'
    ],
  };