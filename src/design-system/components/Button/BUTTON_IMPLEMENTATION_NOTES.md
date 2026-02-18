# Button – implementation notes

Decisions and design tweaks for the Recursica Button that go beyond the [Component Development Guide](../../COMPONENT_GUIDE_WALKTHROUGH.md). Use this when maintaining the Button or when adding similar behavior to other components.

---

## Icon size: Recursica defines it

**Decision:** Icon size is **not** left to the developer. Recursica defines it via the design tokens; the Button enforces it so callers cannot pass an arbitrarily sized icon.

**Implementation:**

- When `icon` is provided, the Button wraps it in a single element with class `iconWrapper` before passing it to Mantine’s `leftSection`. The wrapper is part of our implementation, not a generic “slot” div.
- In `Button.module.css`, `.iconWrapper` has explicit `width` and `height` from the Recursica tokens:
  - `data-size='md'` → `--recursica_ui-kit_components_button_variants_sizes_default_properties_icon`
  - `data-size='sm'` → `--recursica_ui-kit_components_button_variants_sizes_small_properties_icon`
- The rule `.iconWrapper > *` sets `width: 100%`, `height: 100%`, and `object-fit: contain` so whatever the caller passes (SVG, `img`, etc.) is constrained to that box and scales with the token.

**Why:** Mantine does not size the icon; it only sizes the button and the section container. Without this wrapper, developers could pass any size icon and break the visual system. By owning the wrapper and sizing it from tokens, we keep icon size under design-system control.

**For callers:** Pass the icon content only (e.g. an SVG with a `viewBox`). Do not set width/height on the icon; the Button will size it.

---

## Icon-only buttons: accessibility and width

**Decision:** When the button has an icon and no visible label (icon-only), callers must provide an accessible name, and the button must not show extra space to the right of the icon.

**Accessibility:** The standard way to name an icon-only control is the **`aria-label`** attribute on the `<button>`. We document that icon-only buttons must pass `aria-label` (e.g. `aria-label="Submit"`). In development we log a console warning if `icon` is set, `children` is empty, and `aria-label` is missing. We do not throw or block render; the warning is a reminder for developers.

**Width:** With only a left section (icon), Mantine’s layout still applies the section–label gap and the section’s `margin-inline-end`, so the button is wider than the Recursica min-width. We detect icon-only (icon set and no visible children), set `data-icon-only` on the root, and in CSS zero the section gap and the section’s inline margins when `[data-icon-only]` is present. The button then sizes to the Recursica min-width (icon + padding only).

**Implementation:** We treat a button as icon-only when it has at least one section (our `icon` prop maps to Mantine’s `leftSection`; callers can also pass `leftSection` or `rightSection` via rest) and no visible children. `hasVisibleChildren(children)` treats `undefined`, `null`, `''`, and whitespace-only strings as no visible label. Icon-only triggers the dev warning, the `data-icon-only` attribute, and the CSS overrides in `Button.module.css` (`.root[data-icon-only] .section`).

---

## Label truncation at max-width

**Decision:** When the button hits its Recursica max-width (500px), the label truncates with an ellipsis instead of wrapping or overflowing.

**Implementation (all hardcoded; no Recursica tokens):** Recursica defines only `--recursica_ui-kit_components_button_properties_max-width`; it does **not** define overflow or truncation behavior. The following are implementation choices in `Button.module.css` and are listed in the file’s "HARDCODED VALUES" comment:

- **`.root`** – `overflow: hidden` so content is clipped when the root is constrained by max-width.
- **`.root > *`** – `min-width: 0` and `width: 100%` on the direct child (Mantine’s “inner” flex wrapper) so it takes the root’s width and flex children can shrink.
- **`.root .section`** – `min-width: 0` so the section (flex item) can shrink and the label has room to truncate.
- **`.root .label`** – `min-width: 0`, `flex: 1 1 0` (take remaining space so the label has a bounded width), `overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap` so the label text truncates with an ellipsis. Ellipsis only works when the element has a computed width; the flex basis gives it one.

Without this chain of `min-width: 0` and overflow rules, the button would grow past max-width or the text would wrap/overflow; none of these values come from a design token.

**Why the inner span:** Ellipsis truncation in buttons is more reliable when the three properties (`overflow: hidden`, `text-overflow: ellipsis`, `white-space: nowrap`) are applied to an inner element (e.g. a `<span>`) rather than directly on the `<button>`, because default button styles can interfere in some browsers. We apply them to `.label` (the span that wraps the label text). The button gets `overflow: hidden` and a defined width via `max-width`; the inner (Mantine’s flex wrapper) gets `width: 100%` and `min-width: 0`; the label span gets the truncation trio plus `flex: 1 1 0` and `min-width: 0` so it has a computed width. All three requirements are met: overflow is hidden, text is forced to one line, and the truncating element has a defined width.

**Why a `.labelText` wrapper:** Mantine's `.mantine-Button-label` uses `display: flex` for vertical centering. With that, the label's text lives in an anonymous flex item and `text-overflow: ellipsis` often does not paint. We wrap the button's children in `<span className={styles.labelText}>` so the label stays a flex container (vertical centering, height) and the inner span is a block box that gets the truncation styles (overflow, text-overflow, white-space). The label keeps `display: flex; align-items: center`; only `.labelText` has the ellipsis rules and `font-size: inherit; line-height: inherit` so typography matches the root.

---

## Scoped CSS: generic names only

**Decision:** The Button follows the integration rules in the header of `recursica_variables_scoped.css`: it uses only **generic** ui-kit variable names (e.g. `--recursica_ui-kit_components_button_variants_styles_solid_properties_colors_background`). It never references `data-recursica-layer` or `data-recursica-theme` in selectors, and it never uses specific (theme/layer-in-path) variable names. Theme on the document root and layer on an ancestor provide the cascade; the Button just uses the generic names and inherits the right values.

**Implementation:**

- **Single rule per variant:** One rule per variant (and hover) with the generic vars. No layer selectors; inheritance from the Layer wrapper provides the right colors for layer 0–3.
- **Mantine override:** We use the `border` and `background` shorthands so we fully override Mantine’s `background` and any `border: 0` it applies.
- **Text variant border-color:** The generic `_text_properties_colors_border-color` is defined in every theme+layer block (transparent for 0/1/2, layer-3 border for 3), so one `border-color: var(...)` is enough; no fallback hack.
