# Figma to design-system implementation guide

Use this guide when the prompt is: **“Implement this component \<Figma URL\> into the design system.”** It defines the steps and rules to turn a Figma design into a Recursica-styled Mantine wrapper in `design-system/components/`.

For component patterns, TypeScript/SCSS rules, and token usage, follow **[RECURSICA_MANTINE_COMPONENT_GUIDE.md](./RECURSICA_MANTINE_COMPONENT_GUIDE.md)**. This doc is the **Figma-specific workflow**.

---

## 1. Get design and structure from Figma

- Open the Figma URL and locate the **node** (frame/component) that represents the component to implement.
- Note the **component name** in Figma (e.g. “Select”, “Button”, “Menu”).
- If the design **references other Figma components** (e.g. Select dropdown uses the “Menu” component), note those and their node IDs — they map to **Recursica UI Kit component tokens** (e.g. Menu → `--recursica-ui-kit-components-menu-*`).

---

## 2. Map Figma to Recursica tokens

- Open **`design-system/recursica/recursica.css`** and search for variables that match:
  - The **main component** (e.g. `--recursica-ui-kit-components-<component>-*`).
  - **Referenced components** (e.g. dropdown = Menu → `--recursica-ui-kit-components-menu-colors-background`, `--recursica-ui-kit-components-menu-item-colors-*`).
  - **Form fields**: if it’s an input-like control, use **form-field globals** (`--recursica-ui-kit-globals-form-field-*`, `--recursica-ui-kit-globals-form-label-*`).
- Naming pattern: **`--recursica-ui-kit-components-<name>-<colors|size>-<role>[-<state>]`**. See `recursica/adapter/CSS_NAMING_CONVENTION.md`.
- **Only use variables that exist** in `recursica.css`. No hex, magic numbers, or new token names in component SCSS.

---

## 3. Choose Mantine primitive and classNames

- Pick the **Mantine component** that matches behavior (e.g. `Select`, `TextInput`, `Button`, `Menu`).
- From Mantine’s types or docs, get the **`classNames` / styles API** (e.g. `root`, `label`, `input`, `dropdown`, `option`). Wire every part you need to style into a single `classNames` object in the wrapper.
- If the component has sub-parts (e.g. Select = input + dropdown), style the dropdown using the **Figma-referenced component tokens** (e.g. Menu → `menu-colors-background`, `menu-item-colors-*`).

---

## 4. Implement the component

Follow **[RECURSICA_MANTINE_COMPONENT_GUIDE.md](./RECURSICA_MANTINE_COMPONENT_GUIDE.md)** (Section 4 “How to create a new component from scratch”):

1. **Confirm tokens** – Ensure all needed variables exist in `recursica.css` (component, form-field globals, or referenced components like Menu).
2. **Create folder and files** – `ComponentName.tsx`, `ComponentName.module.scss`, `index.ts`, `ComponentName.stories.tsx`.
3. **RecursicaProps** – Only props that the **Figma spec** defines (e.g. variant, size). Omit variants/sizes that Figma does not show.
4. **Mapping** – If our API differs from Mantine’s (e.g. `size: 'default'` → Mantine `size="md"`), use a single mapping constant.
5. **TSX** – `forwardRef`, destructure Recursica props with defaults, spread `{...rest}` to Mantine, pass **classNames** for every styled part.
6. **SCSS** – Use **only** `var(--recursica-...)` (no hardcoded colors/sizes). For parts that mirror another Figma component (e.g. dropdown = Menu), use that component’s tokens (e.g. `menu-colors-background`, `menu-item-colors-text`, `menu-item-colors-hover`, `menu-item-colors-selected`).
7. **Export** – `export { ComponentName, type ComponentNameProps } from './ComponentName'`.

---

## 5. Stories: match Figma only

- **Stories must reflect what Figma specifies.** Do not add variants, sizes, or states that are not in the Figma design (e.g. if Figma has no “small” size, do not add a “small” story or size control).
- Include **named stories** for: default, with label, with description, with error, disabled, with value, and any other state/variant that **Figma shows**.
- Set **argTypes** for all props used in the docs/controls. Omit argTypes for props Figma doesn’t define (e.g. no `size` if there’s only one size in Figma).

---

## 6. Quick reference: Figma component → Recursica tokens

| Figma component / area | Recursica variables (examples) |
|------------------------|---------------------------------|
| Form field (input, select trigger) | `--recursica-ui-kit-globals-form-field-color-*`, `--recursica-ui-kit-globals-form-field-size-*`, `--recursica-ui-kit-globals-form-label-color-default` |
| Dropdown / list (Menu) | `--recursica-ui-kit-components-menu-colors-background`, `--recursica-ui-kit-components-menu-item-colors-text`, `-hover`, `-selected`, `-size-padding` |
| Button | `--recursica-ui-kit-components-button-colors-*`, `--recursica-ui-kit-components-button-size-*` |
| Card, Badge, etc. | `--recursica-ui-kit-components-<name>-colors-*`, `--recursica-ui-kit-components-<name>-size-*` |
| Generic state | `--recursica-brand-state-disabled`, `--recursica-brand-layer-element-text-color`, etc. |

When in doubt, search **`recursica.css`** for the Figma component name (e.g. “menu”, “form-field”, “button”) and use the variables that match the visual role (background, border, text, hover, selected).

---

## 7. Checklist before done

- [ ] Figma node and any referenced components (e.g. Menu) mapped to Recursica tokens.
- [ ] No hardcoded colors/sizes in SCSS; only `var(--recursica-...)`.
- [ ] All Mantine parts that need styling have a corresponding `classNames` entry and SCSS class.
- [ ] RecursicaProps and stories only include what Figma defines (no extra sizes/variants).
- [ ] `displayName` and JSDoc set; `index.ts` exports component and props type.
- [ ] **[RECURSICA_MANTINE_COMPONENT_GUIDE.md](./RECURSICA_MANTINE_COMPONENT_GUIDE.md)** rules followed for a11y, ref, and API.
