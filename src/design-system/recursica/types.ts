/**
 * Type definitions for Recursica CSS Generator
 */

export interface TokenEntry {
  collection: string;
  mode: string;
  name: string;
  type: string;
  value: string | number | TokenReference;
}

export interface TokenReference {
  collection: string;
  name: string;
}

export interface RecursicaBundle {
  pluginVersion: string;
  tokens: Record<string, TokenEntry>;
  uiKit: Record<string, TokenEntry>;
  themes: Record<string, Record<string, TokenEntry>>;
}

export interface ExportingResult {
  content: string;
  path: string;
  filename: string;
}


