/**
 * Cypress Bootstrap Cucumber
 *
 * This file re-exports everything from src/index.js for backward compatibility.
 * It also attempts to run the setup script if it hasn't been run already.
 */

// Try to run the setup script
try {
  const fs = require('fs');
  const path = require('path');
  const userProjectRoot = process.cwd();

  // Check if cypress directory exists, if not, run the setup script
  if (!fs.existsSync(path.join(userProjectRoot, 'cypress'))) {
    console.log('Cypress directory not found. Running setup script...');
    require('./scripts/setup.js');
  }
} catch (error) {
  console.error('Error running setup script:', error.message);
  console.log('Please run the setup script manually using: npx cypress-bootstrap-cucumber-setup');
}

// Export the module
module.exports = require('./src/index.js');
