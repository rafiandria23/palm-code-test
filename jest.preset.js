const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  verbose: true,
  collectCoverage: true,
  mapCoverage: true,
  coverageReporters: ['clover', 'json', 'lcov', 'text'],
  coverageThreshold: {
    global: {
      statements: 100,
      branches: 100,
      functions: 100,
      lines: 100,
    },
  },
};
