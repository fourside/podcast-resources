module.exports = {
  roots: ['<rootDir>/lambda'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
