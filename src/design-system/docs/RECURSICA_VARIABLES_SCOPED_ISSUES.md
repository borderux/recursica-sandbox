# Issues in recursica-variables-scoped.css (Forge / generator fixes)

This document summarizes issues found in the generated `recursica_variables_scoped.css` so the Forge (or the transform that emits the scoped CSS) can be updated to fix them at the source. The scoped file is auto-generated; these changes were applied manually in the sandbox and should be implemented in the generator.

---

## 1. Layer-0 is not the default when only theme is set

**Problem**

The file header says:

- Set `data-recursica-theme="light"` or `"dark"` on root (e.g. `<html>`).
- Set `data-recursica-layer="N"` on any element to apply that layer.

In practice, **layer-0** should be the default when the app sets only theme and does not set `data-recursica-layer` anywhere. Currently, `--recursica_brand_layer_0_*` variables are **only** defined inside:

- `[data-recursica-theme="light"][data-recursica-layer="0"]` and `[data-recursica-theme="light"] [data-recursica-layer="0"]`
- `[data-recursica-theme="dark"][data-recursica-layer="0"]` and `[data-recursica-theme="dark"] [data-recursica-layer="0"]`

So when only `data-recursica-theme="light"` (or `"dark"`) is set and no element has `data-recursica-layer`, the layer-0 brand variables are never defined. UI-kit variables (e.g. button `colors_layer-0_background`) reference them and resolve to nothing, so components like Button have no background color.

**Expected behavior**

- When **only** `data-recursica-theme="light"` or `"dark"` is set → layer-0 styles should apply (default).
- When `data-recursica-layer="1"` (or 2, 3) is set on an ancestor → that layer’s variables override for that subtree.

**Generator fix**

Emit the **same** `--recursica_brand_layer_0_*` variable definitions that are currently in the `[data-recursica-theme="light"][data-recursica-layer="0"]` (and descendant) block **inside** the `[data-recursica-theme="light"]` block as well, so that theme-only implies layer-0. Do the same for the `[data-recursica-theme="dark"]` block using the dark layer-0 values. The existing `[data-recursica-theme="…"][data-recursica-layer="0"]` rules can remain for explicitness; the theme block will define the default.

**Variables to include in theme blocks (layer-0 default)**

For **light** theme block, include the same set as in the current light layer-0 block, e.g.:

- `--recursica_brand_layer_0_elements_interactive_on-tone`
- `--recursica_brand_layer_0_elements_interactive_on-tone-hover`
- `--recursica_brand_layer_0_elements_interactive_tone`
- `--recursica_brand_layer_0_elements_interactive_tone-hover`
- `--recursica_brand_layer_0_elements_text_alert`
- `--recursica_brand_layer_0_elements_text_color`
- `--recursica_brand_layer_0_elements_text_success`
- `--recursica_brand_layer_0_elements_text_warning`
- `--recursica_brand_layer_0_properties_border-color`
- `--recursica_brand_layer_0_properties_border-radius`
- `--recursica_brand_layer_0_properties_border-thickness`
- `--recursica_brand_layer_0_properties_elevation`
- `--recursica_brand_layer_0_properties_padding`
- `--recursica_brand_layer_0_properties_surface`

For **dark** theme block, include the same set as in the current dark layer-0 block (see issue 2 for naming).

---

## 2. Dark theme layer-0: ui-kit expects `_tone` and `_on-tone` as well as `_color`

**Problem**

The ui-kit (and thus components like Button) reference brand layer variables such as:

- `--recursica_brand_layer_0_elements_interactive_tone`
- `--recursica_brand_layer_0_elements_interactive_on-tone`
- `--recursica_brand_layer_0_elements_interactive_tone-hover`
- `--recursica_brand_layer_0_elements_interactive_on-tone-hover`

The **light** layer-0 block defines these. The **dark** `[data-recursica-theme="dark"][data-recursica-layer="0"]` block in the generated file only defined:

- `--recursica_brand_layer_0_elements_interactive_color`
- `--recursica_brand_layer_0_elements_interactive_hover-color`

So in dark theme, `_tone` and `_on-tone` (and hover variants) were undefined, and components that use the ui-kit variables (which reference `_tone` / `_on-tone`) did not get correct colors in dark mode.

**Expected behavior**

In dark theme, the same semantic names used by the ui-kit (`_tone`, `_on-tone`, `_tone-hover`, `_on-tone-hover`) should be defined for layer-0, in addition to or instead of `_color` / `_hover-color` if those are used elsewhere.

**Generator fix**

When emitting the dark theme layer-0 block (and the dark theme default block from issue 1), define:

- `--recursica_brand_layer_0_elements_interactive_tone` (e.g. same value as the dark interactive color/tone)
- `--recursica_brand_layer_0_elements_interactive_tone-hover`
- `--recursica_brand_layer_0_elements_interactive_on-tone`
- `--recursica_brand_layer_0_elements_interactive_on-tone-hover`

using the appropriate dark palette references (e.g. `palette-1_600_color_tone`, `palette-1_600_color_on-tone`), so that ui-kit components work in dark theme without manual overrides.

---

## Summary checklist for Forge

- [ ] **Default layer-0:** Emit layer-0 brand variables inside `[data-recursica-theme="light"]` and `[data-recursica-theme="dark"]` so that setting only theme applies layer-0 by default.
- [ ] **Dark layer-0 naming:** For dark theme layer-0, emit `_tone`, `_on-tone`, `_tone-hover`, and `_on-tone-hover` (not only `_color` / `_hover-color`) so ui-kit references resolve in dark mode.
