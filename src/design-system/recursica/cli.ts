#!/usr/bin/env node

/**
 * CLI entry point for Recursica CSS Generator
 * 
 * Generates a single combined CSS file from recursica-bundle.json containing:
 * - Design tokens
 * - Theme variables (light and dark)
 * - UI Kit component variables
 */

import fs from "fs";
import path from "path";
import type { RecursicaBundle } from "./types";
import { runAdapter } from "./adapter";

// Get __dirname - works in both CommonJS and ESM contexts
let __dirname: string;
try {
  // Try CommonJS first
  if (typeof require !== "undefined" && require.main) {
    __dirname = path.dirname(require.main.filename);
  } else if (typeof __dirname !== "undefined") {
    __dirname = __dirname;
  } else {
    // Fallback to current working directory
    __dirname = process.cwd();
  }
} catch {
  // Fallback to current working directory
  __dirname = process.cwd();
}

/**
 * Main CLI function
 */
export async function runMain(): Promise<void> {
  try {
    const bundlePath = path.join(__dirname, "recursica-bundle.json");
    const outputDir = __dirname;

    console.log("Reading recursica-bundle.json...");
    const bundleContent = fs.readFileSync(bundlePath, "utf-8");
    const bundle: RecursicaBundle = JSON.parse(bundleContent);

    console.log("Generating CSS files...");

    // Run the adapter to generate all CSS files
    const files = runAdapter({
      bundle,
      outputPath: outputDir,
    });

    // Write all files
    for (const file of files) {
      fs.writeFileSync(file.path, file.content, "utf-8");
      console.log(`  - ${file.filename}`);
    }

    console.log("Done! All CSS files generated successfully.");
  } catch (error) {
    console.error("Error generating CSS files:", error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  runMain().catch((error) => {
    console.error("Error running recursica CSS generator:", error);
    process.exit(1);
  });
}

