import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

let errors = [];

// 1. Read README.md, package.json, .env.example
const readmePath = path.join(rootDir, 'README.md');
if (!fs.existsSync(readmePath)) {
  console.error('Error: README.md not found');
  process.exit(1);
}
const readmeContent = fs.readFileSync(readmePath, 'utf8');

const pkgPath = path.join(rootDir, 'package.json');
const pkgContent = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

const envExamplePath = path.join(rootDir, '.env.example');
const envExampleContent = fs.existsSync(envExamplePath)
  ? fs.readFileSync(envExamplePath, 'utf8')
  : '';

// Check 1: Check relative links in README
const markdownLinkRegex = /\[(?:[^\]]+)\]\(([^)]+)\)/g;
let match;
while ((match = markdownLinkRegex.exec(readmeContent)) !== null) {
  const link = match[1].trim();

  // Skip web links, mailto, and top-level page anchor-only links
  if (
    link.startsWith('http://') ||
    link.startsWith('https://') ||
    link.startsWith('mailto:') ||
    link.startsWith('#')
  ) {
    continue;
  }

  // Strip query parameters or anchor hashes
  const cleanLink = link.split('#')[0].split('?')[0];
  if (!cleanLink) continue;

  const targetPath = path.resolve(rootDir, cleanLink);
  if (!fs.existsSync(targetPath)) {
    errors.push(`Relative link in README does not exist: "${link}" (resolved to ${cleanLink})`);
  }
}

// Check 2: Check npm scripts in package.json
const scripts = Object.keys(pkgContent.scripts || {});
for (const scriptName of scripts) {
  // Simple check: Is the script name mentioned in README.md?
  // We check for `scriptName` code-span or plain mention
  const scriptRegex = new RegExp(`\\b${scriptName.replace(':', '\\:')}\\b`);
  if (!scriptRegex.test(readmeContent)) {
    errors.push(`npm script "${scriptName}" from package.json is missing in README.md`);
  }
}

// Check 3: Check VITE_* variables in .env.example
const envVarRegex = /^(VITE_[A-Z0-9_]+)=/gm;
let envMatch;
while ((envMatch = envVarRegex.exec(envExampleContent)) !== null) {
  const envVar = envMatch[1];
  if (!readmeContent.includes(envVar)) {
    errors.push(`Environment variable "${envVar}" from .env.example is missing in README.md`);
  }
}

if (errors.length > 0) {
  console.error('README Check Failed:');
  for (const err of errors) {
    console.error(`- ${err}`);
  }
  process.exit(1);
} else {
  console.log('README Check Passed successfully!');
  process.exit(0);
}
