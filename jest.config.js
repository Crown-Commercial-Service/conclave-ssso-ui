module.exports = {
    preset: 'jest-preset-angular',
    roots: ['src'],
    testMatch: ['**/+(*.)+(spec).+(ts)'],
    setupFilesAfterEnv: ['<rootDir>/src/setup-jest.ts'],
    collectCoverage: true,
    coverageReporters: ['html'],
  };