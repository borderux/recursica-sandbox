#!/usr/bin/env node

import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { writeFileSync } from 'fs';

try {
  const buildsDir = 'builds';
  const builds = [];
  
  // Read the builds directory
  if (readdirSync(buildsDir)) {
    const buildFolders = readdirSync(buildsDir);
    
    for (const folder of buildFolders) {
      const buildPath = join(buildsDir, folder);
      const indexPath = join(buildPath, 'index.html');
      
      // Check if this is a directory and has an index.html
      try {
        const stats = statSync(buildPath);
        if (stats.isDirectory()) {
          try {
            statSync(indexPath); // Check if index.html exists
            builds.push({
              name: folder,
              path: `/${folder}`,
              date: folder.split('_').slice(-1)[0] || 'Unknown'
            });
          } catch (e) {
            // index.html doesn't exist, skip this folder
            console.log(`Skipping ${folder} - no index.html found`);
          }
        }
      } catch (e) {
        // Not a directory or doesn't exist, skip
        console.log(`Skipping ${folder} - not a valid build directory`);
      }
    }
  }
  
  // Sort builds by date (newest first)
  builds.sort((a, b) => b.date.localeCompare(a.date));
  
  // Write the builds list to a JSON file
  const buildsListPath = join('public', 'builds.json');
  writeFileSync(buildsListPath, JSON.stringify(builds, null, 2));
  
  console.log(`✅ Generated builds list with ${builds.length} builds`);
  console.log(`📁 Builds list saved to: ${buildsListPath}`);
  
} catch (error) {
  console.error('❌ Error generating builds list:', error.message);
  process.exit(1);
} 