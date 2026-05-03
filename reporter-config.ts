export const reporterConfig = {
  reporterEnabled: 'cypress-mochawesome-reporter, mocha-junit-reporter',
  cypressMochawesomeReporterReporterOptions: {
    charts: true,
    reportPageTitle: 'Test Report',
    reportDir: 'cypress/reports/html',
    embeddedScreenshots: true,
    inlineAssets: true,
    html: true,
    json: true,
  },
  mochaJunitReporterReporterOptions: {
    mochaFile: 'cypress/reports/junit/results-[hash].xml',
    toConsole: true,
    reporterOptions: {
      mochaFile: 'cypress/reports/junit/results-[hash].xml',
      attachments: true,
      testCaseSwitchClassnameAndName: true,
    },
  },
};
