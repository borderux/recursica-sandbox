/**
 * Layer Management Utilities
 *
 * Theme-agnostic naming: --recursica-brand-layer-layer-{id}-{property} (source)
 * Output names: --recursica-brand-layer-{element|property}-* (no "current", no layer id)
 */

const LAYER_VAR_PATTERN =
  /--recursica-brand-layer-layer-(.+?)-(element-[^:\s]+|property-[^:\s]+)/;

/**
 * Detects if a CSS variable reference contains a layer reference.
 */
export function isLayerReference(cssVar: string): boolean {
  return /--recursica-brand-layer-layer-/.test(cssVar);
}

/**
 * Extracts the layer identifier from a layer reference.
 * e.g. "--recursica-brand-layer-layer-0-property-surface" → "layer-0"
 */
export function extractLayerId(cssVar: string): string | null {
  const match = cssVar.match(/--recursica-brand-layer-layer-([^-\s]+(?:-[^-\s]+)*?)(?=-)/);
  return match ? `layer-${match[1]}` : null;
}

/**
 * Converts a layer reference to the canonical layer var (no layer id in name).
 * e.g. "--recursica-brand-layer-layer-0-property-surface" → "--recursica-brand-layer-property-surface"
 */
export function convertToCurrentLayer(cssVar: string): string {
  return cssVar.replace(
    /--recursica-brand-layer-layer-[^-\s]+(?:-[^-\s]+)*?-/,
    "--recursica-brand-layer-"
  );
}

/**
 * Extracts the property path from a layer reference.
 */
export function extractLayerProperty(cssVar: string): string | null {
  const match = cssVar.match(/--recursica-brand-layer-layer-[^-\s]+(?:-[^-\s]+)*-(.+)/);
  return match ? match[1] : null;
}

/**
 * Groups layer variables by layer ID and property.
 */
export interface LayerVariable {
  layerId: string;
  property: string;
  fullVarName: string;
  value: string;
}

export function groupLayerVariables(
  cssLines: string[],
): Map<string, Map<string, LayerVariable>> {
  const layerMap = new Map<string, Map<string, LayerVariable>>();

  for (const line of cssLines) {
    const layerMatch = line.match(LAYER_VAR_PATTERN);
    if (!layerMatch) continue;

    const layerIdPart = layerMatch[1];
    const propertyPart = layerMatch[2];
    const layerId = `layer-${layerIdPart}`;

    const match = line.match(/^\s*(--[^:]+):\s*(.+);/);
    if (!match) continue;

    const fullVarName = match[1];
    const value = match[2];

    if (!layerMap.has(layerId)) {
      layerMap.set(layerId, new Map());
    }
    const propertyMap = layerMap.get(layerId)!;
    propertyMap.set(propertyPart, {
      layerId,
      property: propertyPart,
      fullVarName,
      value,
    });
  }

  return layerMap;
}

/**
 * Generates layer selector CSS for a specific layer.
 * Uses canonical names: --recursica-brand-layer-{element|property}-*
 */
export function generateLayerSelector(
  layerId: string,
  properties: Map<string, LayerVariable>,
  themeClassName: string,
): string {
  const selector = `.${themeClassName} .${layerId}`;
  const lines: string[] = [];

  for (const [property, layerVar] of properties) {
    const varName = `--recursica-brand-layer-${property}`;
    lines.push(`  ${varName}: ${layerVar.value};`);
  }

  if (lines.length === 0) return "";
  return `${selector} {\n${lines.join("\n")}\n}`;
}

/**
 * Generates default layer variables (using layer-0 as default).
 */
export function generateDefaultLayerVariables(
  layer0Properties: Map<string, LayerVariable>,
): string[] {
  const lines: string[] = [];

  for (const [property, layerVar] of layer0Properties) {
    const varName = `--recursica-brand-layer-${property}`;
    lines.push(`  ${varName}: ${layerVar.value};`);
  }

  return lines;
}

