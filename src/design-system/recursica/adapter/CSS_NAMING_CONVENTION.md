# Recursica adapter: CSS output naming convention

This document describes how bundle **input** (token/theme/ui-kit paths) is turned into **output** CSS variable names. The adapter generates a single `recursica.css` with `:root` (tokens + UI Kit) and theme classes (e.g. `.eyepopbrand-light-theme`, `.eyepopbrand-dark-theme`). All generated variables use the `--recursica-` prefix.

**Pattern: theme-agnostic names.** Each semantic token has **one** CSS variable name. Light vs dark is not encoded in the name; the **theme class** on an ancestor sets the value. So you get fewer, clearer variable names and no duplication like `--recursica-brand-themes-light-palettes-...` and `--recursica-brand-themes-dark-palettes-...`.

---

## 1. Design tokens (Tokens)

**Source:** `recursica-bundle.json` → `tokens`  
**Input:** `token.name` (e.g. from keys like `[tokens][Mode-1][color/marine/800]` → name is `color/marine/800`)  
**Output scope:** `:root`

Path segments are normalized: slashes and spaces become hyphens, casing is lowercased. Colors use normalized levels (e.g. `100` → `100`, `000`/`1000` kept).

| Input (token name)   | Output (CSS variable name)                 |
| -------------------- | ------------------------------------------ |
| `color/marine/800`   | `--recursica-tokens-colors-marine-800`     |
| `color/gray/050`     | `--recursica-tokens-colors-gray-050`       |
| `size/2x`            | `--recursica-tokens-sizes-2x`              |
| `opacity/smoky`      | `--recursica-tokens-opacities-smoky`       |
| `font/size/2xs`      | `--recursica-tokens-font-sizes-2xs`        |
| `font/family/prompt` | `--recursica-tokens-font-typefaces-prompt` |
| `effect/2x`          | `--recursica-tokens-effect-2x`             |

**Example final CSS:**

```css
:root {
  --recursica-tokens-colors-marine-800: #0e205b;
  --recursica-tokens-colors-gray-300: #d9dbe9;
  --recursica-tokens-sizes-2x: 16px;
  --recursica-tokens-opacities-smoky: 94;
  --recursica-tokens-font-sizes-2xs: 10px;
  --recursica-tokens-font-typefaces-prompt: Prompt;
}
```

---

## 2. Theme variables (Brand)

**Source:** `recursica-bundle.json` → `themes`  
**Input:** `token.name` (e.g. from `[themes][Light][palette/neutral/default/tone]` → name is `palette/neutral/default/tone`)  
**Output scope:** theme class (e.g. `.eyepopbrand-light-theme`, `.eyepopbrand-dark-theme`)

**Theme-agnostic naming:** One variable name per semantic (e.g. `--recursica-brand-palettes-neutral-default-tone`). The **same** name is used in both light and dark; the theme class sets the value. No `themes-light-` or `themes-dark-` in the name.

| Input (theme path)                   | Output (CSS variable name)                              |
| ------------------------------------ | ------------------------------------------------------- |
| `palette/neutral/default/tone`       | `--recursica-brand-palettes-neutral-default-tone`       |
| `palette/palette-2/800/low-emphasis` | `--recursica-brand-palettes-palette-2-800-low-emphasis` |
| `layer/layer-0/property/surface`     | `--recursica-brand-layer-layer-0-property-surface`      |
| `layer/layer-3/element/text/success` | `--recursica-brand-layer-layer-3-element-text-success`  |
| `elevation/elevation-1/shadow-color` | `--recursica-brand-elevations-elevation-1-shadow-color` |
| `state/disabled`                     | `--recursica-brand-state-disabled`                      |
| `state/hover`                        | `--recursica-brand-state-hover`                         |
| `text-emphasis/high`                 | `--recursica-brand-text-emphasis-high`                  |
| `dimension/gutter/horizontal`        | `--recursica-brand-dimensions-gutter-horizontal`        |
| `font/h1/font-size`                  | `--recursica-brand-typography-h1-font-size`             |
| `font/h2/weight`                     | `--recursica-brand-typography-h2-weight`                |

**Example final CSS:**

```css
.eyepopbrand-light-theme {
  --recursica-brand-palettes-neutral-default-tone: var(
    --recursica-tokens-colors-gray-100
  );
  --recursica-brand-layer-property-surface: var(
    --recursica-brand-palettes-neutral-default-tone
  );
  --recursica-brand-layer-element-text-color: var(
    --recursica-brand-palettes-black
  );
  --recursica-brand-elevations-elevation-1-shadow-color: rgba(0, 0, 0, 0.12);
  --recursica-brand-state-disabled: var(--recursica-tokens-opacities-smoky);
}

.eyepopbrand-light-theme .layer-0 {
  --recursica-brand-layer-property-surface: var(
    --recursica-brand-palettes-neutral-default-tone
  );
  --recursica-brand-layer-element-text-color: var(
    --recursica-brand-palettes-black
  );
}

.eyepopbrand-light-theme .layer-1 {
  --recursica-brand-layer-property-surface: var(
    --recursica-tokens-colors-gray-000
  );
  --recursica-brand-layer-element-text-color: var(
    --recursica-brand-palettes-neutral-050-on-tone
  );
}

.eyepopbrand-dark-theme {
  /* same variable names, different values */
}
```

Layer variables use canonical names `--recursica-brand-layer-{element|property}-*` (no layer id in the name). The theme class sets defaults; `.layer-0`, `.layer-1`, etc. override them so components use one variable that resolves by DOM context.

---

## 3. UI Kit variables

**Source:** `recursica-bundle.json` → `uiKit`  
**Input:** path from key (e.g. `[ui-kit][0][global/form/field/color/background]` → path is `global/form/field/color/background`)  
**Output scope:** `:root` (mode 0) and `.theme .layer-1`, `.theme .layer-2`, `.theme .layer-3` (mode 1, 2, 3 overrides)

UI Kit tokens are keyed by mode: `[ui-kit][0]` = default (layer-0), `[ui-kit][1]` = layer-1, `[ui-kit][2]` = layer-2, `[ui-kit][3]` = layer-3. Mode 0 is emitted under `:root`. Modes 1–3 are emitted as overrides under each theme’s layer selectors (e.g. `.eyepopbrand-light-theme .layer-1 { ... }`) so that components inside a layer get the correct UI Kit values (e.g. card background = layer surface for layer-1/2/3).

Theme-agnostic: one variable name per semantic. Values may reference brand vars that are overridden per theme/layer.

| Input (path)                           | Output (CSS variable name)                                     |
| -------------------------------------- | -------------------------------------------------------------- |
| `global/icon/style`                    | `--recursica-ui-kit-globals-icon-style`                        |
| `global/form/field/color/background`   | `--recursica-ui-kit-globals-form-field-color-background`       |
| `global/form/field/size/border-radius` | `--recursica-ui-kit-globals-form-field-size-border-radius`     |
| `card/color/outline`                   | `--recursica-ui-kit-components-card-colors-outline`            |
| `button/color/background-solid`        | `--recursica-ui-kit-components-button-colors-background-solid` |
| `accordion/color/label`                | `--recursica-ui-kit-components-accordion-colors-label`         |

**Example final CSS:**

```css
:root {
  --recursica-ui-kit-globals-icon-style: outline;
  --recursica-ui-kit-globals-form-field-color-background: var(
    --recursica-brand-layer-property-surface
  );
  --recursica-ui-kit-components-card-colors-background: rgba(243, 245, 255, 0);
  --recursica-ui-kit-components-button-colors-background-solid: var(
    --recursica-brand-palettes-palette-1-500-tone
  );
}

.eyepopbrand-light-theme .layer-1 {
  --recursica-ui-kit-components-card-colors-background: var(
    --recursica-brand-layer-property-surface
  );
}
```

---

## 4. Summary rules

| Namespace     | Prefix                     | Theme in name? | Example                                             |
| ------------- | -------------------------- | -------------- | --------------------------------------------------- |
| Tokens        | `--recursica-tokens-`      | No             | `--recursica-tokens-colors-marine-800`              |
| Brand         | `--recursica-brand-`       | No             | `--recursica-brand-palettes-neutral-default-tone`   |
| Brand (layer) | `--recursica-brand-layer-` | No             | `--recursica-brand-layer-property-surface`          |
| UI Kit        | `--recursica-ui-kit-`      | No             | `--recursica-ui-kit-components-card-colors-outline` |

- **Segment separator:** hyphens (`-`).
- **Casing:** lowercased.
- **Theme application:** Same variable name everywhere; light/dark is applied by the **selector** (e.g. `.eyepopbrand-light-theme` vs `.eyepopbrand-dark-theme`), so you get one name per semantic and no redundant `themes-light-` / `themes-dark-` variables.
