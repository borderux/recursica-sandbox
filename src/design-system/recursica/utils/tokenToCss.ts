/**
 * Token to CSS transformation utilities
 * 
 * Converts design tokens into CSS custom properties following the Recursica pattern.
 */

import type { TokenEntry, TokenReference } from "../types";

/**
 * Configuration options for token-to-CSS transformation
 */
export interface TokenToCssOptions {
  /** Whether to include only string and number values (for basic tokens) */
  filterPrimitives?: boolean;
  /** Custom CSS variable name transformation function */
  nameTransform?: (key: string, mode?: string) => string;
  /** Whether to handle token references (objects with collection/name) */
  handleReferences?: boolean;
  /** Theme mode (light/dark) for theme token generation */
  mode?: string;
}

/**
 * Default CSS variable name transformation
 * Converts token names to kebab-case CSS custom property format
 */
export function defaultNameTransform(key: string): string {
  return key.replace(/[/\s]/g, "-").toLowerCase();
}

/**
 * Normalizes color level to match recursica-forge convention (050, 000, 1000, 100-900).
 */
function normalizeColorLevel(level: string): string {
  const s = String(level).trim().toLowerCase();
  if (s === "000" || s === "1000") return s;
  const padded = s.padStart(3, "0");
  if (["050", "100", "200", "300", "400", "500", "600", "700", "800", "900"].includes(padded)) {
    return padded;
  }
  return s.replace(/^0+/, "") || s;
}

/**
 * Transforms token name to CSS variable with --recursica-tokens- prefix.
 * Matches recursica-forge naming:
 * - color|colors/family|scale-XX/level → recursica-tokens-colors-{family}-{level}
 * - size|sizes/name → recursica-tokens-sizes-{name}
 * - opacity|opacities/name → recursica-tokens-opacities-{name}
 * - font/size|sizes/key → recursica-tokens-font-sizes-{key}
 * - font/weight|weights/key → recursica-tokens-font-weights-{key}
 * - font/letter-spacing|letter-spacings/key → recursica-tokens-font-letter-spacings-{key}
 * - font/line-height|line-heights/key → recursica-tokens-font-line-heights-{key}
 * - font/typeface|typefaces/key → recursica-tokens-font-typefaces-{key}
 * - font/family/key → recursica-tokens-font-typefaces-{key} (family as typefaces)
 * Other tokens: recursica-tokens-{path-with-hyphens}
 */
export function tokenNameToCssVar(tokenName: string): string {
  const parts = tokenName.replace(/[/\s]+/g, "/").split("/").filter(Boolean).map((p) => p.toLowerCase());
  if (parts.length === 0) return "recursica-tokens";

  const [category, ...rest] = parts;

  if (category === "color" || category === "colors") {
    if (rest.length >= 2) {
      const [familyOrScale, level] = rest;
      const normalizedLevel = normalizeColorLevel(level);
      return `recursica-tokens-colors-${familyOrScale}-${normalizedLevel}`;
    }
  }
  if (category === "size" || category === "sizes") {
    if (rest.length >= 1) return `recursica-tokens-sizes-${rest[0]}`;
  }
  if (category === "opacity" || category === "opacities") {
    if (rest.length >= 1) return `recursica-tokens-opacities-${rest[0]}`;
  }
  if (category === "font" && rest.length >= 2) {
    const [kind, key] = rest;
    const pluralMap: Record<string, string> = {
      size: "sizes",
      sizes: "sizes",
      weight: "weights",
      weights: "weights",
      "letter-spacing": "letter-spacings",
      "letter-spacings": "letter-spacings",
      "line-height": "line-heights",
      "line-heights": "line-heights",
      typeface: "typefaces",
      typefaces: "typefaces",
      family: "typefaces",
    };
    const pluralKind = pluralMap[kind] || kind;
    return `recursica-tokens-font-${pluralKind}-${key}`;
  }

  const normalized = tokenName.replace(/[/\s]+/g, "-").toLowerCase();
  return `recursica-tokens-${normalized}`;
}

/**
 * Transforms theme path to CSS variable with --recursica-brand- prefix.
 * Theme-agnostic naming: one variable name per semantic token. The theme (light/dark)
 * is applied by the selector (e.g. .eyepopbrand-light-theme sets light values,
 * .eyepopbrand-dark-theme sets dark values). No themes-{mode}- in the name.
 */
export function themePathToCssVar(themePath: string): string {
  const normalized = themePath.replace(/[/\s]+/g, "-").toLowerCase();

  if (normalized.startsWith("palette-")) {
    const pathWithoutPrefix = normalized.replace(/^palette-/, "");
    return `recursica-brand-palettes-${pathWithoutPrefix}`;
  }
  if (normalized.startsWith("layer-")) {
    // Map UI Kit shorthand theme paths to canonical theme variable names
    if (normalized === "layer-surface") return "recursica-brand-layer-property-surface";
    if (normalized === "layer-color") return "recursica-brand-layer-element-text-color";
    return `recursica-brand-${normalized}`;
  }
  if (normalized.startsWith("elevation-")) {
    const pathWithoutPrefix = normalized.replace(/^elevation-/, "");
    return `recursica-brand-elevations-${pathWithoutPrefix}`;
  }
  if (normalized.startsWith("state-")) {
    const pathWithoutPrefix = normalized.replace(/^state-/, "");
    return `recursica-brand-state-${pathWithoutPrefix}`;
  }
  if (normalized.startsWith("text-emphasis-")) {
    const pathWithoutPrefix = normalized.replace(/^text-emphasis-/, "");
    return `recursica-brand-text-emphasis-${pathWithoutPrefix}`;
  }
  if (normalized.startsWith("dimension-")) {
    const pathWithoutPrefix = normalized.replace(/^dimension-/, "");
    return `recursica-brand-dimensions-${pathWithoutPrefix}`;
  }
  if (normalized.startsWith("font-")) {
    const pathWithoutPrefix = normalized.replace(/^font-/, "");
    return `recursica-brand-typography-${pathWithoutPrefix}`;
  }
  if (normalized.startsWith("layout-")) {
    const pathWithoutPrefix = normalized.replace(/^layout-/, "");
    return `recursica-brand-dimensions-${pathWithoutPrefix}`;
  }

  return `recursica-brand-${normalized}`;
}

/**
 * Transforms UI Kit path to CSS variable with --recursica-ui-kit- prefix.
 * Theme-agnostic: one variable name per semantic. Theme is applied by selector.
 */
export function uiKitPathToCssVar(path: string): string {
  let normalized = path.replace(/^ui-kit\//, "");

  if (normalized.startsWith("global/")) {
    normalized = normalized.replace(/^global\//, "globals/");
  } else {
    normalized = normalized.replace(/^([^/]+)\/color\//, "components/$1/colors/");
    normalized = normalized.replace(/^([^/]+)\/size\//, "components/$1/size/");
    if (!normalized.startsWith("components/") && !normalized.startsWith("globals/")) {
      normalized = `components/${normalized}`;
    }
  }

  // Remove parentheses so CSS custom property names are valid (e.g. (on-dark) -> on-dark)
  const noParens = normalized.replace(/\(([^)]*)\)/g, "$1");
  const pathHyphens = noParens.replace(/[/\s]+/g, "-").toLowerCase();
  return `recursica-ui-kit-${pathHyphens}`;
}

/**
 * Formats a value based on its type and token name
 */
function formatValue(
  value: string | number,
  type: string,
  tokenName: string = "",
): string {
  if (type === "color") {
    return String(value);
  }

  if (type === "string") {
    return String(value);
  }

  if (type === "float" || type === "number") {
    // Opacity values should not have units
    if (tokenName.startsWith("opacity/") || tokenName.startsWith("opacities/")) {
      return String(value);
    }
    // All other float/number values get 'px' unit
    return `${value}px`;
  }

  return String(value);
}

/**
 * Resolves a token reference to a CSS variable
 */
function resolveTokenReference(tokenName: string): string {
  const cssVarName = tokenNameToCssVar(tokenName);
  return `var(--${cssVarName})`;
}

/**
 * Resolves a theme reference to a CSS variable
 */
function resolveThemeReference(themePath: string): string {
  const cssVarName = themePathToCssVar(themePath);
  return `var(--${cssVarName})`;
}

/**
 * Resolves a value that might be a reference
 */
function resolveValue(
  value: string | number | TokenReference,
  type: string,
  tokenName: string = ""
): string | null {
  // If it's an object reference
  if (typeof value === "object" && value !== null) {
    const ref = value as TokenReference;
    if (ref.collection === "Tokens" && ref.name) {
      return resolveTokenReference(ref.name);
    }
    if (ref.collection === "Themes" && ref.name) {
      return resolveThemeReference(ref.name);
    }
  }

  // Direct value
  if (typeof value === "string" || typeof value === "number") {
    return formatValue(value, type, tokenName);
  }

  return null;
}

/**
 * Converts a token entry to a CSS custom property string
 */
export function tokenEntryToCss(
  token: TokenEntry,
  options: TokenToCssOptions = {},
  mode?: string,
): string | null {
  const {
    nameTransform = defaultNameTransform,
  } = options;

  // Ensure token.name exists
  if (!token.name) {
    return null;
  }

  // Filter out tokens with trailing numbers or spaces (likely data entry errors)
  // e.g., "hover-color 2" or "hover-color-2" at the end
  const nameTrimmed = token.name.trim();
  if (/\s+\d+$/.test(nameTrimmed) || /-\d+$/.test(nameTrimmed.split('/').pop() || '')) {
    // Check if there's a duplicate without the number
    // For now, we'll skip tokens with trailing numbers/spaces
    return null;
  }

  const cssVarName = nameTransform(token.name, mode || options.mode);
  const value = resolveValue(token.value, token.type, token.name);

  if (value === null) {
    return null;
  }

  return `  --${cssVarName}: ${value};`;
}

/**
 * Converts a collection of token entries to CSS custom properties
 */
export function tokensToCssVariables(
  tokens: Record<string, TokenEntry>,
  options: TokenToCssOptions = {},
  mode?: string,
): string[] {
  const { filterPrimitives = false } = options;

  const cssLines = Object.entries(tokens)
    .filter(([_, token]) => {
      if (filterPrimitives) {
        return (
          typeof token.value === "string" || typeof token.value === "number"
        );
      }
      return true;
    })
    .map(([_, token]) => tokenEntryToCss(token, options, mode))
    .filter((line): line is string => line !== null);

  // Deduplicate by CSS variable name (extract the variable name from the line)
  const seen = new Set<string>();
  const unique: string[] = [];
  
  for (const line of cssLines) {
    // Extract variable name from line like "  --var-name: value;"
    const match = line.match(/^\s*--([^:]+):/);
    if (match) {
      const varName = match[1].trim();
      if (!seen.has(varName)) {
        seen.add(varName);
        unique.push(line);
      }
    } else {
      // If we can't parse it, include it anyway
      unique.push(line);
    }
  }

  return unique.sort(); // Sort for consistent output
}

/**
 * Predefined configurations for different token types
 */
export const TOKEN_CONFIGS = {
  /** Configuration for basic design tokens (primitives only) */
  BASIC_TOKENS: {
    filterPrimitives: true,
    nameTransform: tokenNameToCssVar,
    handleReferences: false,
  } as TokenToCssOptions,

  /** Configuration for UI Kit tokens (with references). Theme-agnostic names. */
  UI_KIT_TOKENS: {
    filterPrimitives: false,
    nameTransform: uiKitPathToCssVar,
    handleReferences: true,
  } as TokenToCssOptions,

  /** Configuration for theme tokens (with references) - mode should be passed when calling */
  THEME_TOKENS: {
    filterPrimitives: false,
    nameTransform: (key: string) => themePathToCssVar(key),
    handleReferences: true,
  } as TokenToCssOptions,
} as const;

