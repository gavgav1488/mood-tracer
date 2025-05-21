const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Путь к приложению Next.js
  dir: './',
});

// Пользовательская конфигурация Jest
const customJestConfig = {
  // Добавляем больше настроек Jest
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    // Обработка импортов с алиасами
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.next/',
  ],
  transform: {
    // Используем babel-jest для обработки файлов JS/TS/TSX
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  transformIgnorePatterns: [
    '/node_modules/',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/pages/_app.tsx',
    '!src/pages/_document.tsx',
  ],
};

// createJestConfig экспортирует конфигурацию Next.js для Jest
module.exports = createJestConfig(customJestConfig);
