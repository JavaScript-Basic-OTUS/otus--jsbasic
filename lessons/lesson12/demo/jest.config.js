/** @type {import('jest').Config} */
const config = {
  // Среда выполнения тестов (node для серверного кода)
  testEnvironment: "node",

  // Поддержка ES модулей, так как в package.json указан "type": "module"
  preset: "ts-jest/presets/default-esm",

  // Паттерны для поиска тестовых файлов
  testMatch: [
    "**/__tests__/**/*.js", // Файлы в папке __tests__
    "**/?(*.)+(spec|test).js", // Файлы с суффиксами .test.js или .spec.js
  ],

  // Настройки покрытия кода
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],

  // Исключить из анализа покрытия
  coveragePathIgnorePatterns: ["/node_modules/", "/coverage/", "/docs/"],

  // Настройки для работы с ES модулями (новый синтаксис)
  transform: {
    "^.+\\.js$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },

  // Расширения файлов для разрешения модулей
  moduleFileExtensions: ["js", "json"],

  // Verbose вывод для детальной информации о тестах
  verbose: true,

  // Очистка моков между тестами
  clearMocks: true,

  // Показать покрытие в консоли
  collectCoverageFrom: [
    "src/**/*.js",
    "!src/index.js", // Исключить главный файл из анализа покрытия
  ],
};

export default config;
