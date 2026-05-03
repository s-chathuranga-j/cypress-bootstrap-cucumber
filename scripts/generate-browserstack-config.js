#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const templatePath = path.join(root, 'browserstack.template.json');
const outputPath = path.join(root, 'browserstack.generated.json');

if (!fs.existsSync(templatePath)) {
  throw new Error(`BrowserStack template not found at ${templatePath}`);
}

const requiredEnv = ['BROWSERSTACK_USERNAME', 'BROWSERSTACK_ACCESS_KEY'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(`Missing required environment variables: ${missingEnv.join(', ')}`);
}

const template = fs.readFileSync(templatePath, 'utf8');
const generated = template.replace(/\$\{([A-Z0-9_]+)\}/g, (_, key) => process.env[key] || '');

JSON.parse(generated);
fs.writeFileSync(outputPath, `${generated}\n`);
console.log(`Generated ${path.relative(root, outputPath)}`);
