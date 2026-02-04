/**
 * Main entry point for Recursica CSS Generator
 */

import { runMain } from "./cli";

// Run the CLI
runMain().catch((error) => {
  console.error("Error running recursica CSS generator:", error);
  process.exit(1);
});


