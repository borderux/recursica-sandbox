#!/usr/bin/env node

import { execSync } from 'child_process';
import { mkdirSync, existsSync } from 'fs';
import { join } from 'path';

try {
  // Get git username, fallback to 'ci' in CI environments
  let gitUsername;
  try {
    gitUsername = execSync('git config user.name', {
      encoding: 'utf8',
    }).trim();
  } catch (gitError) {
    // Fallback for CI environments where git user.name might not be set
    gitUsername = process.env.CI ? 'ci' : 'local';
  }
  const safeUsername = gitUsername.replace(/\s+/g, '_');

  // Get current timestamp
  const now = new Date();
  const timestamp =
    now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    '_' +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');

  // Create builds directory if it doesn't exist
  const buildsDir = 'builds';
  if (!existsSync(buildsDir)) {
    mkdirSync(buildsDir, { recursive: true });
  }

  // Create unique build folder name
  const buildFolderName = `${safeUsername}_${timestamp}`;
  const buildPath = join(buildsDir, buildFolderName);

  console.log(`Building Storybook to: ${buildPath}`);

  // Run storybook build
  execSync(`storybook build -o ${buildPath}`, { stdio: 'inherit' });

  console.log(`✅ Storybook build completed successfully in: ${buildPath}`);
} catch (error) {
  console.error('❌ Error building Storybook:', error.message);
  process.exit(1);
}
