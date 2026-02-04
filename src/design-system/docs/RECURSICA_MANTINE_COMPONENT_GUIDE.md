# Recursica + Mantine component pattern

This guide describes how to build design-system components that **wrap Mantine** and **style them with Recursica** (design tokens and UI Kit variables from `recursica.css`). Use it when creating a new component from scratch or when reviewing existing wrappers.

---

## 1. Architecture overview

| Layer | Role |
|-------|------|
| **Mantine** | Behavior, accessibility, DOM structure, and base `data-*` attributes (e.g. `data-size`, `data-variant`). We do **not** override Mantine’s default styles; we replace them via `classNames` and CSS. |
| **Recursica** | Single source of truth for look & feel. `recursica.css` exposes CSS variables under `--recursica-tokens-*`, `--recursica-brand-*`, and `--recursica-ui-kit-components-*`. No hardcoded colors/sizes in component SCSS. |
| **Wrapper (our component)** | Thin adapter: define a small **Recursica API** (e.g. `variant`, `size`), map to Mantine’s API when needed, attach styles via `classNames` or `className` as appropriate, and style in SCSS using **only** Recursica variables and Mantine’s `data-*` attributes. |

Design tokens and UI Kit tokens live in `recursica-bundle.json`; `design-system/recursica/` generates `recursica.css`. Variable naming is documented in `recursica/adapter/CSS_NAMING_CONVENTION.md`.

---

## 2. Pattern: TypeScript and styling

### 2.1 TypeScript: Recursica API + Mantine composition

- **`RecursicaProps`** – Design-system API only (e.g. `variant`, `size`). JSDoc on the interface and/or props. No Mantine-only props.
- **Public props** = `RecursicaProps` & Mantine’s props. No duplication of Mantine props in RecursicaProps.
- **Mapping (only when needed)** – If Recursica’s API differs from Mantine’s (e.g. different size names or variant strings), use mapping constants so there is a single source of truth. If the APIs already align, pass props through directly.
- **Ref** – Wrap in `forwardRef` and pass ref to the underlying Mantine component.
- **Spreading** – Destructure Recursica-specific props, then `{...rest}` (and ref) to Mantine so behavior and HTML attributes stay intact.

### 2.2 Styling: SCSS + Recursica variables only

- **Attaching styles** – Prefer **`classNames`** when the Mantine component supports overriding its internal parts (e.g. `root`, `section`, `icon`, `loader`); that lets you target each part in SCSS. Otherwise use **`className`** on the root. Do not mix both for the same root element.
- **No hardcoded design values** – No hex colors, magic pixel sizes, or raw shadows. Use only:
  - `var(--recursica-ui-kit-components-<component>-...)` for component-specific tokens
  - `var(--recursica-brand-...)` for brand/layer/state (e.g. disabled, interactive color)
  - `var(--recursica-tokens-...)` when needed for primitives
- **Selectors keyed off Mantine’s data attributes** – Mantine sets `data-size`, `data-variant`, etc. Use them in SCSS (e.g. `&[data-size='sm']`, `&[data-variant='filled']`) so one stylesheet works for all variants/sizes without extra props in the DOM.
- **States** – Use `:disabled`, `:hover`, `:focus` (or Mantine’s data attributes for state) and again only Recursica variables for colors/opacity (e.g. `--recursica-brand-state-disabled`).

### 2.3 File layout

- **`ComponentName.tsx`** – Component logic, RecursicaProps, any mapping, forwardRef, Mantine usage.
- **`ComponentName.module.scss`** – All Recursica-based styles; no inline styles for design tokens.
- **`index.ts`** – Re-export: `export { ComponentName, type ComponentNameProps } from './ComponentName'`.

Optional: a second SCSS module when the same Recursica API is implemented by a different Mantine primitive (e.g. text+icon vs icon-only); each primitive gets its own module and is wired via `classNames`.

---

## 3. Architecture and pattern rules

Components should follow these rules so the design system stays consistent, accessible, and maintainable.

### 3.1 Accessibility

- **Rely on Mantine** – Use Mantine’s behavior and DOM so a11y (focus, keyboard, ARIA) comes from the library. Do not remove or override Mantine’s aria-* unless you have a specific reason and document it.
- **Forward ref** – Always forward ref to the Mantine root so callers can manage focus or attach refs.
- **Icon-only / no visible text** – When the component has no visible label (e.g. icon-only button), require or strongly encourage an accessible name: `aria-label` (or `aria-labelledby`). Pass it through via `...rest`; document the requirement in JSDoc and in Storybook.
- **Loading and disabled** – Rely on Mantine to set `aria-busy` / `aria-disabled` where applicable; do not strip these from `rest`.

### 3.2 Customization and overrides

- **No design tokens via props** – Do not accept props that let callers override design tokens (e.g. `backgroundColor` or `sizePx`). The only way to change look is the component’s own API (variant, size) and Recursica tokens.
- **className / style** – Use `classNames` or `className` only to attach the component’s own Recursica styles. Do not support one-off overrides (e.g. merging a caller’s `className` onto the root). If a use case needs a different look or behavior, extend the component’s API or add a new variant/size in the design system and in Recursica tokens so the change is explicit and consistent.
- **Composition props** – Prefer the design-system API (e.g. `icon` + `iconPosition`) over passing Mantine’s composition props (e.g. `leftSection`) directly, so usage is consistent. If you do pass through a Mantine slot, document it and ensure it doesn’t bypass Recursica styling.

### 3.3 Defaults and API consistency

- **Explicit defaults** – Set default values for Recursica props (e.g. `variant = 'primary'`, `size = 'default'`) in the component so the design-system default is clear and consistent everywhere.
- **Theme and layout** – Components only consume CSS variables. Applying the theme class (e.g. `.eyepopbrand-light-theme`) or layer (e.g. `.layer-1`) is the app’s responsibility. The wrapper does not set theme or layer.

### 3.4 Developer experience

- **Display name** – Set `Component.displayName = 'ComponentName'` (or the wrapper name) so React dev tools and error messages show a clear name.
- **JSDoc on the component** – Add a one-line JSDoc above the component (or its export) so Storybook’s docs panel shows a description.
- **Stable classNames** – Prefer passing module references (e.g. `styles.root`) into `classNames` so the object shape is stable across renders. Avoid building `classNames` from inline objects that change every render unless necessary.

### 3.5 Compound components

- If the design system has a component with sub-parts (e.g. Card with CardSection), apply the same wrapper pattern to each part: RecursicaProps (if any), Mantine component, SCSS with Recursica variables only.
- Export a single public surface: either a namespace (e.g. `Card.Root`, `Card.Section`) or flat exports (`Card`, `CardSection`). Keep the pattern consistent across the design system.

---

## 4. How to create a new component from scratch

Follow these steps to add a new Recursica-styled Mantine wrapper.

### Step 1: Confirm tokens exist in Recursica

- Open `design-system/recursica/recursica.css` (or the generator output you use).
- Check that UI Kit variables exist for your component, e.g.:
  - `--recursica-ui-kit-components-<component>-colors-*`
  - `--recursica-ui-kit-components-<component>-size-*`
- Naming pattern: `--recursica-ui-kit-components-<component>-<colors|size>-<role>[-<state>]`. See `recursica/adapter/CSS_NAMING_CONVENTION.md` (UI Kit section).
- If variables are missing, add the tokens to the source (e.g. recursica-forge / Figma export), then regenerate `recursica.css` (e.g. `npx tsx main.ts` in `design-system/recursica/`).

### Step 2: Create the folder and files

```
design-system/components/<ComponentName>/
  index.ts
  <ComponentName>.tsx
  <ComponentName>.module.scss
  <ComponentName>.stories.tsx
```

Stories are required: they document all use cases, support visual regression, and serve as living docs. They must demonstrate every variant, size, and meaningful state explicitly (not only via Knobs) and have **argTypes** set correctly so the docs table and controls are accurate.

### Step 3: Define RecursicaProps and public props

- Add an interface **`RecursicaProps`** with only the design-system API (variant, size, etc.). Use JSDoc for the interface and for each prop.
- Export **`ComponentNameProps = RecursicaProps & MantineComponentNameProps`** (intersect with the Mantine component’s props).
- Choose Recursica values that match the tokens (e.g. if CSS has `data-variant='primary' | 'alert'`, your variant type should align).

Example shape:

```ts
/**
 * Recursica design system props for the ComponentName component.
 */
interface RecursicaProps {
  /** Visual style. */
  variant?: 'primary' | 'secondary'
  /** Size. */
  size?: 'default' | 'small'
  // ... only design-system concerns
}

export type ComponentNameProps = RecursicaProps & MantineComponentNameProps
```

### Step 4: Add mapping constants (only if needed)

Add mapping only when Recursica’s API does not match Mantine’s (e.g. different size or variant names). For example:

- **Size:** `MAP_SIZE_TO_ATTRIBUTE = { default: 'md', small: 'sm', ... }` so Recursica `size` maps to Mantine’s size prop.
- **Variant:** `MAP_STYLE_TO_VARIANT` (or similar) from Recursica variant to the string Mantine expects. Those strings must match what Mantine sets on the DOM (e.g. `data-variant='filled'`) and what you use in SCSS.

If your Recursica API already uses the same values Mantine uses, pass them through and skip mapping.

### Step 5: Implement the component

- Use `forwardRef` and pass ref to the Mantine component.
- Destructure Recursica props and set defaults. Spread the rest onto the Mantine component (`{...rest}`).
- Pass **size**, **variant** (or equivalent) either directly or via mapping constants, depending on Step 4.
- Attach styles: use **classNames** when the Mantine component lets you override internal parts (root, section, icon, etc.); otherwise use **className** on the root.
- Do not add inline styles for colors/sizes; keep all design tokens in SCSS.

### Step 6: Write the SCSS

- **Root class** – Target the Mantine root. Set layout/sizing only with Recursica variables (e.g. `height: var(--recursica-ui-kit-components-<name>-size-default-height)`).
- **Variants** – Use `&[data-variant='...']` and only Recursica variables for colors/backgrounds/borders (e.g. `background-color: var(--recursica-ui-kit-components-<name>-colors-background-primary)`).
- **Sizes** – Use `&[data-size='sm']` (and similar) and again only variables for dimensions.
- **States** – Use `:disabled`, `:hover`, etc., and semantic tokens (e.g. `opacity: var(--recursica-brand-state-disabled)`).
- **Sub-parts** – If Mantine renders inner nodes (e.g. section, icon), assign them in `classNames` and style in the same module with Recursica variables.

Do not introduce new design values (hex, px for design tokens); only `var(--recursica-...)`.

### Step 7: Export from index

- `export { ComponentName, type ComponentNameProps } from './ComponentName'`

### Step 8: Add Storybook stories

- Add stories that **demonstrate all use cases**: every variant, every size, and important states (e.g. disabled, loading). Do not rely only on Knobs; include explicit named stories so the component works for visual regression and as documentation.
- Set **argTypes** for all props (variant, size, disabled, etc.) so the docs table and controls are correct and complete.

---

## 5. Checklist for new components

- [ ] Recursica variables exist in `recursica.css` for this component (UI Kit and/or brand).
- [ ] `RecursicaProps` defines only the design-system API; no Mantine-only props.
- [ ] Public props = `RecursicaProps` & Mantine props; ref is forwarded.
- [ ] Mapping constants added only when Recursica API differs from Mantine’s; when used, they are the single source of truth.
- [ ] Defaults set for Recursica props (variant, size, etc.); no design-token overrides via props.
- [ ] No one-off overrides: do not merge caller `className`/`style` onto the root; extend the component API or add variants/tokens instead.
- [ ] Styles attached via `classNames` when Mantine supports part overrides, otherwise via `className`.
- [ ] SCSS uses only `var(--recursica-...)`; no hardcoded colors/sizes/shadows.
- [ ] SCSS selects by Mantine’s `data-*` attributes (e.g. `data-size`, `data-variant`).
- [ ] Icon-only / no visible label: `aria-label` (or equivalent) documented and passed through.
- [ ] `displayName` set on the component; JSDoc on the component for Storybook docs.
- [ ] `index.ts` re-exports the component and its props type.
- [ ] Storybook stories demonstrate all use cases (variants, sizes, states) and have argTypes set for all props.

---

## 6. Reference: CSS variable naming (UI Kit)

For a component named `<name>`, the generator produces names like:

- **Colors:** `--recursica-ui-kit-components-<name>-colors-<role>[-<state>]`  
  e.g. `background-solid`, `background-solid-hover`, `text-solid`, `outline`, `outline-hover`
- **Size:** `--recursica-ui-kit-components-<name>-size-<role>`  
  e.g. `default-height`, `default-min-width`, `small-height`, `border-radius`, `default-icon`

Use these exact names in your SCSS. If a token is missing, add it to the design source and regenerate `recursica.css`; do not substitute with hardcoded values.

---

## 7. When one API is implemented by two Mantine primitives

Sometimes one Recursica component corresponds to two Mantine components (e.g. text+icon vs icon-only). Pattern:

- One **RecursicaProps** and one public props type.
- In the component, branch on props (e.g. icon without children → render one primitive, else the other).
- Two SCSS modules: one per Mantine primitive. Wire each via `classNames` (root, section, icon, etc.).
- Use the same mapping constants (if any) and the same Recursica variables; only the Mantine component and the classNames shape differ.

That keeps a single public API while using the correct Mantine primitive and Recursica tokens per case.

---

## 8. Additional tips

- **Prerequisites** – The app (and Storybook) must load `recursica.css` and apply the right theme class (e.g. `.eyepopbrand-light-theme`) on an ancestor so variables resolve. Use a Storybook decorator or global wrapper if needed.
- **Discovering Mantine’s API** – To see which `data-*` attributes and `classNames` keys a Mantine component uses, render it and inspect the DOM, or check [Mantine’s component docs](https://mantine.dev/core/). Your SCSS and `classNames` must match those keys.
- **Don’t leak Recursica props into the DOM** – Destructure every Recursica-specific prop (variant, size, etc.) so they are not in `rest`. Only spread `rest` onto the Mantine component; otherwise you may pass invalid HTML attributes or confuse Mantine.
- **Visual regression** – If you use a tool (e.g. Chromatic, Percy), ensure stories that cover all variants/sizes are included in the regression set. The guide’s story requirements support that.
- **Cross-reference** – Variable naming details live in `recursica/adapter/CSS_NAMING_CONVENTION.md`; refer to it when adding or debugging tokens.
