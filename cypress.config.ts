import { addCucumberPreprocessorPlugin } from '@badeball/cypress-cucumber-preprocessor';
import { createEsbuildPlugin } from '@badeball/cypress-cucumber-preprocessor/esbuild';
import createBundler from '@bahmutov/cypress-esbuild-preprocessor';
import { defineConfig } from 'cypress';
import mochawesomeReporter from 'cypress-mochawesome-reporter/plugin';
import { reporterConfig } from './reporter-config';

const addAccessibilityTasks = require('wick-a11y/accessibility-tasks');
const browserstackAccessibility = require('browserstack-cypress-cli/bin/accessibility-automation/plugin');
const cypressOnFix = require('cypress-on-fix');

let token: string | undefined;
let tempData: unknown;

export default defineConfig({
  retries: 0,
  reporter: 'cypress-multi-reporters',
  reporterOptions: reporterConfig,
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL || 'https://www.saucedemo.com/',
    defaultCommandTimeout: 30000,
    responseTimeout: 30000,
    requestTimeout: 30000,
    chromeWebSecurity: false,
    viewportWidth: 1920,
    viewportHeight: 1080,
    watchForFileChanges: false,
    experimentalRunAllSpecs: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    screenshotOnRunFailure: true,
    testIsolation: false,
    specPattern: 'cypress/tests/**/*.feature',
    fixturesFolder: 'cypress/testdata',
    env: {
      authUrl: process.env.CYPRESS_AUTH_URL || 'https://saucedemo.com/connect/token',
      apiBaseUrl: process.env.API_BASE_URL || 'http://localhost:3100',
      swaggerSchemaUrl:
        process.env.SWAGGER_SCHEMA_URL ||
        `${process.env.API_BASE_URL || 'http://localhost:3100'}/swagger.json`,
    },
    async setupNodeEvents(on, config) {
      const fixedOn = cypressOnFix(on);

      await addCucumberPreprocessorPlugin(fixedOn, config);
      fixedOn(
        'file:preprocessor',
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      mochawesomeReporter(fixedOn);
      addAccessibilityTasks(fixedOn);
      browserstackAccessibility(fixedOn, config);

      fixedOn('task', {
        setToken: (newToken: string) => {
          token = newToken;
          return null;
        },
        getToken: () => token,
        setTempData: (newTempData: unknown) => {
          tempData = newTempData;
          return null;
        },
        getTempData: () => tempData,
      });

      return config;
    },
  },
});
