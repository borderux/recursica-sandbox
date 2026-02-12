# Component Development Guide

This guide defines how to build design-system components that wrap UI libraries (e.g. Mantine) and style them with Recursica (design tokens and UI Kit CSS variables). Use it when creating a new component or when reviewing existing wrappers.

## Core principles

1. **Single way to style** – Use **CSS modules only** (e.g. `Button.module.css`). No inline styles for design tokens, no mix of plain `.css` and `.css.ts`.
2. **Recursica props** – Define a clear Recursica (design-system) API. Public props merge Recursica props with the underlying library’s props; Recursica is preferred when both define the same concern. Map Recursica → library in the component before calling the library.
3. **Component-scoped CSS** – Do not add global CSS. All overrides apply only to the component instance by attaching your module’s root class to the **library’s root element** (via `classNames.root` or `className`). No wrapper divs. Stock library components elsewhere in the app are unchanged.

---

## 1. Styling

- **One file per library implementation:** `{ComponentName}.module.css`. All styling (overrides of the library) lives in this file.
- **Order in the CSS module:** Put **baseline/reset first**, then **style overrides**. Start with a `.root` block (or equivalent) that sets preset or hard-coded values for layout and box model (e.g. `position`, `margin`, `border-style`, `box-sizing`). That makes it explicit what we are setting as the baseline. Follow with rules that use Recursica/theme CSS variables for typography, colors, sizes, etc. This keeps “what we assume” separate from “what comes from tokens.”
- **Hardcoded values:** Hardcoded values (e.g. `border: none`, `margin: 0`, `width: 100%`) are a potential source of error—there may be or should be a CSS variable. In the module: (1) **List them at the top of the file** in a "HARDCODED VALUES" section in the file comment: what is hardcoded, where, why, and that it may need a token later. (2) **At each hardcoded declaration**, add an inline comment (e.g. `/* HARDCODE: reason; consider token if … */`) so it's clear on scan and easy to revisit.
- **No inline design tokens in TSX** – The component does not set `style={{ ... }}` for colors, sizes, typography, or other design tokens. All such values come from the CSS module.
- **No custom properties set from TSX for styling** – The CSS module should reference Recursica/UIKit variables directly (e.g. `var(--recursica-ui-kit-components-button-...)`). If a “bridge” custom property is ever needed, document it as an exception.
- **Design tokens only in CSS** – In the module, use only Recursica/UIKit CSS variables. No hex colors, magic pixel values, or raw shadows.
- **Selectors keyed off library `data-*`** – Use `[data-size]`, `[data-variant]`, etc. so one stylesheet handles all variants and sizes.
- **Attach styles via `classNames` or `className`** – Prefer **`classNames`** when the library supports overriding its internal parts (e.g. `root`, `section`, `label`); pass your module’s root class (e.g. `classNames={{ root: styles.root }}`) so the library root element gets your scoped class. Optionally pass part classes (e.g. `section: styles.section`) to target inner parts without `:global()`. Otherwise use **`className`** on the root. Do not mix both for the same root element. Do not use inline style objects for design.

Do not use plain `.css` for component overrides, and do not use `.css.ts` with `globalStyle` or other global selectors.

---

## 2. Component-scoped CSS (no global, no wrapper divs)

- Overrides must not affect the rest of the app. They apply only to instances of your component. **Do not use wrapper divs.** Stock library components used elsewhere must keep their default look.
- **Attach your module class to the library root** – Pass the module’s root class to the library so the **library’s root element** receives it (e.g. `classNames={{ root: styles.root }}` or `className={styles.root}`). That element then has both the library’s classes and your hashed module class; only your component instances get that class, so only they receive your overrides.
- **Recursica-only attributes on the library root** – When you need layer or other Recursica state in CSS (e.g. `data-layer`), pass them through to the library root only when the caller provides a value (e.g. `data-layer={layer}` when `layer !== undefined`). When omitted, the component does not set `data-layer`, so layer can cascade from an ancestor or default to layer-0 (see **Layers** below). In the module, target with `.root[data-layer='layer-0']`, `.root[data-variant='filled']`, etc.
- **Layers** – **layer-0 is the default.** It is the same as not providing a layer on the component or on a surrounding div. Implement and document in the CSS module: (1) **Default:** When the root has no `data-layer` and no ancestor has `[data-layer]`, use layer-0 styles (e.g. `.root:not([data-layer])[data-variant='filled']` with layer-0 theme vars). (2) **Cascade:** When a wrapping element has `[data-layer='layer-X']`, styles for that layer apply to the component’s root inside it (e.g. `[data-layer='layer-1'] .root[data-variant='filled']`). (3) **Component prop (highest precedence):** When the component sets `data-layer` on the root (because the caller passed a `layer` prop), use `.root[data-layer='layer-X']` rules; place these after the cascade rules so they override. Order in the stylesheet: default (layer-0 when no data-layer) first, then ancestor cascade, then component-prop rules.
- **Target the root in the module** – Your `.root` class is on the same element as the library root (e.g. the button). Write root-level rules as `.root { ... }`, `.root[data-size='xs'] { ... }`, `.root[data-variant='filled'] { ... }`, `.root[data-layer='layer-0'][data-variant='filled'] { ... }`. No need for `:global()` on the root itself.
- **Target inner parts** – For the library’s internal parts (e.g. section, label), either (a) pass part classes via `classNames` (e.g. `section: styles.section`) and target `.root .section` in the module, or (b) keep targeting the library’s part classes under your root with `.root :global(.mantine-Button-leftSection) { ... }`. Both are scoped because the selector only matches when that part is inside the element with your `.root` class (your component’s root).
- Do not emit standalone global selectors (e.g. no `globalStyle` or top-level `.mantine-Button-root`).

---

## 3. Props: Recursica and library

### 3.1 Recursica prop layer (unified API)

- **Start with Recursica props** – The Recursica props interface is the **generic prop layer** that applies to all UI-kit adapters (Mantine, Material, Carbon, native HTML, etc.). Define it first; it is the design-system API only (e.g. `variant`, `size`, `layer`, `elevation`, `icon`). Add JSDoc on the interface and important props.
- **Goal: one API, any kit** – The goal is a **unified prop layer** for Recursica components that works with any underlying UI-kit or HTML element. Each adapter is responsible for **mapping** Recursica props to the underlying kit’s API. Creating a component therefore requires **understanding each target kit’s prop API** so you can define a single Recursica API that maps cleanly in every adapter.
- **Use standard HTML props when possible** – Do not change or redefine default HTML attribute types. Use native props (e.g. `type`, `title`, `disabled`, `onClick`) as-is and pass them through to the root element. They are part of the public props but not part of the “Recursica-only” design-system interface.
- **Unifying kit-specific concepts** – Kits often differ (e.g. one has `leftSection`/`rightSection`, another has `startIcon`/`endIcon`). When defining the Recursica API, unify where it makes sense: e.g. `icon` can be synonymous for “left/leading icon” if that’s the common case; a separate prop or `...rest` can cover the other side. Document the convention (e.g. “icon = leading icon”) in the component or guide.

### 3.2 Public props and mapping

- **Public props** – Export `ComponentNameProps = RecursicaProps & LibraryComponentNameProps` (and standard HTML/React props as appropriate). Do not duplicate library props in the Recursica interface.
- **Recursica preferred** – When Recursica and the library both define the same concern (e.g. size), Recursica wins. In each adapter, map Recursica values to library values and pass the result to the library. Callers can still pass library-specific props via `...rest` or library prop bags for escape hatches.
- **Mapping** – In each library implementation, destructure Recursica props, apply defaults, then compute library props (e.g. `mantineVariant`, `mantineSize`) using mapping constants when the APIs differ, e.g. `MAP_VARIANT = { solid: 'filled', outline: 'outline', text: 'subtle' }`. Render the library component with these mapped props plus `...rest`.
- **No design tokens via props** – Do not accept props that override design tokens (e.g. `backgroundColor`, `sizePx`, `height`, `minWidth`, `maxWidth`). Look is controlled by variant/size and by tokens in the CSS module. The forge UI shows **design token properties** (e.g. height, min-width, max-width) from the component’s token structure (e.g. UIKit.json); those are edited in the toolbar and applied as CSS variable values. They are not part of the Recursica component props API — the component only exposes a small set of props (variant, size, layer, elevation, icon, etc.); dimensions and other token-driven values come from the CSS module that references those variables.
- **Caller `className` / `style`** – You may allow optional `className` and `style` to be passed through to the library root so callers can add overrides. Document that Recursica styling comes from the module and caller values are additive.
- **Multi-library** – If the adapter supports multiple libraries, use library-specific prop bags (e.g. `mantine?: { ... }`) so callers can pass library-specific options. The implementation for each library reads its bag and merges into the props passed to that library.

---

## 4. Structure and behavior

- **No wrapper divs** – Do not add any wrapper element for styling. The library component is the only root; attach your module class (and any `data-*` attributes) to that root via `classNames` or `className`. Use the library’s composition (e.g. `leftSection`, `rightSection`) as intended.
- **Do not modify component structure** – Do not wrap content in custom elements for styling, conditionally change structure, or alter the library’s expected DOM.
- **Forward ref** – Forward ref to the library’s root element so focus and refs work correctly.
- **Accessibility** – Rely on the library for focus, keyboard, and ARIA. Do not strip or override the library’s accessibility attributes unless documented. For icon-only or otherwise unlabeled usage, require or encourage an accessible name (e.g. `aria-label`) and pass it through.
- **Display name and JSDoc** – Set `Component.displayName` and add a brief JSDoc on the component for devtools and docs.
- **Stable classNames** – Pass module classes (e.g. `styles.root`) into `classNames`/`className`. Avoid building new objects every render when not necessary.

---

## 5. Adapter and folder structure

- **Adapter** – The top-level component (e.g. `adapters/Button.tsx`) is the public API. It uses the component registry and renders the active library’s implementation. It does not contain styling logic; it passes props through (including any needed for elevation or other special cases).
- **Folder structure** – `src/components/adapters/{ComponentName}.tsx` for the adapter; `src/components/adapters/{library}/{ComponentName}/` for each library (e.g. `mantine/Button/Button.tsx` and `mantine/Button/Button.module.css`).
- **Reactive token logic** – Prefer no React state or `useEffect` for design token updates. With styling in the CSS module and `var(...)` references, the browser updates when document CSS variables change. If one exception is required (e.g. elevation computed to box-shadow), keep it in the adapter or a small helper and document it.

---

## 6. Design tokens and variable naming

- **Single source of truth** – All design values come from Recursica/UIKit CSS variables. No hardcoded design values in TSX or in the CSS module (beyond `var(...)` references).
- **Reference tokens only in the CSS module** – In `{ComponentName}.module.css`, use the project’s variable naming (e.g. `--recursica-ui-kit-components-{component}-...`). The component TSX does not set design token values on the root.
- Document or link to the project’s CSS variable naming convention so the module uses the correct names.

---

## 7. Reactive updates

- Do not use `useEffect`, `useState`, or custom events to react to design token changes for styling. Use `var(...)` in the CSS module so the browser applies updates when variables change.
- If a single exception is needed (e.g. elevation token → box-shadow computed in JS), implement it in one place (adapter or helper), document it, and keep it minimal.

---

## 8. Files per library implementation

- **Required:** `{ComponentName}.tsx` and `{ComponentName}.module.css`. No `.css.ts`, no separate plain `.css` for overrides.
- **Optional:** `index.ts` to re-export the component and props type; an audit or doc file (e.g. `Button.mantine.audit.md`) for documentation only.

---

## 9. Testing and workflow

- **Toolbar integration tests** – Required for components that participate in the toolbar (e.g. `{ComponentName}.toolbar.test.tsx`).
- **Unit tests** – Cover the adapter and library implementation; follow existing test patterns in the repo.
- **Toolbar config and sidebar** – Add toolbar configuration and sidebar entry as required by the project workflow for new components.
- Components do not require changes to global CSS; they use only their module.

---

## 10. Checklist for a new component

- [ ] Recursica/UIKit variables exist for this component (or are planned).
- [ ] Recursica props interface is defined first (unified prop layer for all adapters); use standard HTML props as-is; public props = Recursica & library/HTML props.
- [ ] Defaults set for Recursica props; mapping constants used when Recursica and library APIs differ.
- [ ] Library implementation: destructure Recursica props, map to library props, render library component with mapped props and `...rest`; ref forwarded.
- [ ] One CSS module: `{ComponentName}.module.css`. Baseline/reset first (preset or hard-coded layout/box model on `.root`), then style overrides using Recursica/UIKit `var(...)`. All overrides scoped under `.root`; use `:global()` only for library inner-part classes (e.g. `.root :global(.mantine-Button-section)`); no global selectors. Hardcoded values: list at top of file in "HARDCODED VALUES" section and add inline `/* HARDCODE: … */` at each.
- [ ] No wrapper div. Library root receives module class via `classNames.root` or `className`; Recursica attributes (e.g. `data-layer`) passed to library root when provided (layer-0 is default; omit data-layer when layer prop not set so default/cascade applies); no inline styles for design tokens.
- [ ] No design tokens via props; no `useEffect`/state for token-driven styling (except one documented exception if needed).
- [ ] displayName and JSDoc set; icon-only / unlabeled usage documented (e.g. aria-label).
- [ ] Toolbar integration test and any required toolbar/sidebar config added.
