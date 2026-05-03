#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const commands = {
  setup: {
    description: 'Set up the Cypress Bootstrap Cucumber framework in your project',
    action: runSetup,
  },
  help: {
    description: 'Show help information',
    action: showHelp,
  },
  version: {
    description: 'Show the version of the Cypress Bootstrap Cucumber package',
    action: showVersion,
  },
};

const args = process.argv.slice(2);
const command = args[0] || 'setup';

if (commands[command]) {
  commands[command].action();
} else {
  console.error(`Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}

function runSetup() {
  console.log('Setting up Cypress Bootstrap Cucumber framework...');

  try {
    require('../scripts/setup.js');
    console.log('\nSetup completed successfully!');
    console.log('Run "npm run cypress:open" to open the Cypress Test Runner.');
  } catch (error) {
    console.error('Error running setup script:', error.message);
    console.error('Please try running the setup script manually:');
    console.error('  npx cypress-bootstrap-cucumber-setup');
    process.exit(1);
  }
}

function showHelp() {
  console.log('Cypress Bootstrap Cucumber CLI');
  console.log('');
  console.log('Usage:');
  console.log('  npx cypress-bootstrap-cucumber <command>');
  console.log('');
  console.log('Commands:');

  Object.keys(commands).forEach(cmd => {
    console.log(`  ${cmd.padEnd(10)} ${commands[cmd].description}`);
  });

  console.log('');
  console.log('Examples:');
  console.log('  npx cypress-bootstrap-cucumber setup');
  console.log('  npx cypress-bootstrap-cucumber help');
  console.log('  npx cypress-bootstrap-cucumber version');
}

function showVersion() {
  try {
    const packageJsonPath = path.join(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log(`Cypress Bootstrap Cucumber v${packageJson.version}`);
  } catch (error) {
    console.error('Error reading package.json:', error.message);
    process.exit(1);
  }
}
