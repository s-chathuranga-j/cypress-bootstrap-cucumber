#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageRoot = path.resolve(__dirname, '..');
const initialCwd = process.env.INIT_CWD ? path.resolve(process.env.INIT_CWD) : null;
const userProjectRoot = initialCwd && initialCwd !== packageRoot ? initialCwd : process.cwd();
const isPostinstall = process.env.npm_lifecycle_event === 'postinstall';

if (process.env.CYPRESS_BOOTSTRAP_SETUP_RUNNING === '1') {
  console.log('Cypress Bootstrap Cucumber setup is already running, skipping nested setup');
  process.exit(0);
}

function isScaffoldPackageRoot(root) {
  const packageJsonPath = path.join(root, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  return packageJson.name === 'cypress-bootstrap-cucumber';
}

if (packageRoot === userProjectRoot && isScaffoldPackageRoot(packageRoot)) {
  console.log('Running in package directory, skipping setup');
  process.exit(0);
}

const directories = [
  'cypress',
  'cypress/downloads',
  'cypress/pages',
  'cypress/reports',
  'cypress/screenshots',
  'cypress/support',
  'cypress/support/step_definitions',
  'cypress/testbase',
  'cypress/testdata',
  'cypress/tests',
  'cypress/tests/api',
  'cypress/tests/ui',
  'cypress/videos',
  '.github/workflows',
  '.github/prompts',
  '.ai/skills/cypress-bootstrap-cucumber/references',
  '.codex/skills/cypress-bootstrap-cucumber/agents',
  '.claude/skills/cypress-bootstrap-cucumber',
  '.cursor/rules',
  'docs',
  'scripts',
  'subscription-api',
];

const filesToCopy = [
  'AGENTS.md',
  'CLAUDE.md',
  '.cypress-cucumber-preprocessorrc.json',
  '.github/copilot-instructions.md',
  '.github/prompts/cypress-bootstrap-cucumber.prompt.md',
  '.github/workflows/browserstack-accessibility.yml',
  '.ai/README.md',
  '.ai/agent-guidelines.md',
  '.ai/skills/cypress-bootstrap-cucumber/SKILL.md',
  '.ai/skills/cypress-bootstrap-cucumber/references/authoring.md',
  '.ai/skills/cypress-bootstrap-cucumber/references/explaining-and-reviewing.md',
  '.codex/skills/cypress-bootstrap-cucumber/SKILL.md',
  '.codex/skills/cypress-bootstrap-cucumber/agents/openai.yaml',
  '.claude/skills/cypress-bootstrap-cucumber/SKILL.md',
  '.cursor/rules/framework.md',
  '.windsurfRules',
  'browserstack.template.json',
  'cypress.config.ts',
  'cypress.env.example.json',
  'reporter-config.ts',
  'tsconfig.json',
  '.prettierrc',
  '.prettierignore',
];

const specialFiles = [{ source: 'gitignore', dest: '.gitignore' }];
const directoriesToCopy = [
  '.ai',
  '.codex',
  '.claude',
  '.cursor',
  '.github',
  'cypress/testbase',
  'cypress/testdata',
  'cypress/tests',
  'cypress/support',
  'cypress/pages',
  '.husky',
  'docs',
  'scripts',
  'subscription-api',
];

function copyFileIfMissing(sourceRelativePath, destinationRelativePath = sourceRelativePath) {
  const sourcePath = path.join(packageRoot, sourceRelativePath);
  const destinationPath = path.join(userProjectRoot, destinationRelativePath);

  if (!fs.existsSync(sourcePath)) {
    console.log(`Warning: Source file not found: ${sourceRelativePath}, skipping`);
    return;
  }

  if (fs.existsSync(destinationPath)) {
    return;
  }

  fs.mkdirSync(path.dirname(destinationPath), { recursive: true });
  fs.copyFileSync(sourcePath, destinationPath);
  console.log(`Copied file: ${destinationRelativePath}`);
}

function copyDir(src, dest) {
  if (!fs.existsSync(src)) {
    return;
  }

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
      continue;
    }

    if (!fs.existsSync(destPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(
        `Copied file: ${path.relative(packageRoot, srcPath)} to ${path.relative(
          userProjectRoot,
          destPath
        )}`
      );
    }
  }
}

function mergePackageJson() {
  const packageJson = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf8'));
  const scaffoldDependencies = packageJson.devDependencies || packageJson.dependencies || {};
  const userPackageJsonPath = path.join(userProjectRoot, 'package.json');
  const userPackageJson = fs.existsSync(userPackageJsonPath)
    ? JSON.parse(fs.readFileSync(userPackageJsonPath, 'utf8'))
    : {
        name: 'cypress-cucumber-project',
        version: '1.0.0',
        description: 'Project using cypress-bootstrap-cucumber',
      };

  const scaffoldScripts = {
    'cypress:run': packageJson.scripts['cypress:run'],
    'cypress:run:smoke': packageJson.scripts['cypress:run:smoke'],
    'cypress:run:ui': packageJson.scripts['cypress:run:ui'],
    'cypress:run:api': packageJson.scripts['cypress:run:api'],
    'cypress:run:a11y': packageJson.scripts['cypress:run:a11y'],
    'cypress:cloud:run': packageJson.scripts['cypress:cloud:run'],
    'cypress:open': packageJson.scripts['cypress:open'],
    'api:start': packageJson.scripts['api:start'],
    'api:test': packageJson.scripts['api:test'],
    'browserstack:config': packageJson.scripts['browserstack:config'],
    'browserstack:a11y': packageJson.scripts['browserstack:a11y'],
    typecheck: packageJson.scripts.typecheck,
    setup: packageJson.scripts.setup,
    format: packageJson.scripts.format,
    'format:check': packageJson.scripts['format:check'],
    prepare: packageJson.scripts.prepare,
  };

  userPackageJson.scripts = {
    ...scaffoldScripts,
    ...(userPackageJson.scripts || {}),
  };
  userPackageJson.devDependencies = {
    ...(userPackageJson.devDependencies || {}),
    ...scaffoldDependencies,
  };
  userPackageJson['lint-staged'] = userPackageJson['lint-staged'] || packageJson['lint-staged'];

  fs.writeFileSync(userPackageJsonPath, `${JSON.stringify(userPackageJson, null, 2)}\n`);
}

directories.forEach(dir => {
  const dirPath = path.join(userProjectRoot, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  }
});

filesToCopy.forEach(file => copyFileIfMissing(file));
specialFiles.forEach(file => copyFileIfMissing(file.source, file.dest));

if (!fs.existsSync(path.join(userProjectRoot, 'cypress.env.json'))) {
  copyFileIfMissing('cypress.env.example.json', 'cypress.env.json');
}

directoriesToCopy.forEach(dir => {
  const sourcePath = path.join(packageRoot, dir);
  const destPath = path.join(userProjectRoot, dir);

  if (fs.existsSync(sourcePath)) {
    copyDir(sourcePath, destPath);
    console.log(`Copied directory: ${dir}`);
  }
});

console.log('Updating package.json scripts and devDependencies...');
mergePackageJson();

if (isPostinstall) {
  console.log('Skipping nested dependency install during npm postinstall.');
  console.log('Run "npm install" once more if newly added devDependencies are not installed yet.');
} else {
  console.log('Installing dependencies. This may take a few minutes...');
  try {
    execSync('npm install', {
      cwd: userProjectRoot,
      stdio: 'inherit',
      env: {
        ...process.env,
        CYPRESS_BOOTSTRAP_SETUP_RUNNING: '1',
      },
    });
    console.log('Dependencies installed successfully!');
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
    console.log('Please run "npm install" manually to install the required dependencies.');
  }
}

console.log('Setup completed successfully!');
console.log(
  'You can now customize cypress/pages, cypress/tests, cypress/testbase, and cypress/testdata.'
);
