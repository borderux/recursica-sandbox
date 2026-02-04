/**
 * Adapter index - exports all CSS generation functions
 */

import type { ExportingResult, RecursicaBundle } from "../types";
import { generateCombinedCss } from "./generateCombinedCss";

export interface RunAdapterParams {
  bundle: RecursicaBundle;
  outputPath: string;
}

export type RunAdapterOutput = ExportingResult[];

/**
 * Main adapter function that generates a single combined CSS file
 */
export function runAdapter({
  bundle,
  outputPath,
}: RunAdapterParams): RunAdapterOutput {
  const files: ExportingResult[] = [];

  // Generate single combined CSS file with tokens, themes, and UI Kit
  const combinedCss = generateCombinedCss(
    bundle.tokens,
    bundle.themes,
    bundle.uiKit,
    outputPath
  );
  files.push(combinedCss);

  return files;
}

export { generateCombinedCss };



