import{r as i,j as e}from"./iframe-B2rOdtrB.js";import{P as r}from"./Panel-DM7qJBmZ.js";import{B as n}from"./Button-HhlW-IcM.js";import{T as c}from"./Text-CKARdXex.js";import"./preload-helper-D9Z9MdNV.js";import"./filterStylingProps-Dc62mC8D.js";import"./Loader-CtOuuTZY.js";const b={title:"UI-Kit/Panel",component:r,tags:["autodocs"],argTypes:{placement:{control:"select",options:["left","right","top","bottom"],description:"Side of the screen the panel slides in from."},title:{control:"text",description:"Panel title displayed in the header."},withOverlay:{control:"boolean",description:"Whether to display a background overlay."},withCloseButton:{control:"boolean",description:"Whether to display the close button in the header."},wrapHeaderText:{control:"boolean",description:"If true, forces the header text to a single line and truncates with an ellipsis."},defaultChecked:{table:{disable:!0}},defaultValue:{table:{disable:!0}},suppressContentEditableWarning:{table:{disable:!0}},suppressHydrationWarning:{table:{disable:!0}}},parameters:{layout:"fullscreen",docs:{description:{component:`
The \`Panel\` component slides in or expands from the edge of the screen to reveal additional content or functionality. Built on Mantine's \`Drawer\`, it enforces Recursica design tokens for styling.

### Anatomy
1. **Header** — Title and close icon, remains fixed on scroll
2. **Divider** — Separates header/footer from content
3. **Body (Slot)** — Scrollable content area for custom content
4. **Footer** — Fixed action buttons (Recursica-specific)

### Usage
\`\`\`tsx
const [opened, { open, close }] = useDisclosure(false);

<Button onClick={open}>Open Panel</Button>
<Panel opened={opened} onClose={close} title="Settings" placement="right">
  Content goes here
  <Panel.Footer>
    <Button variant="outline">Cancel</Button>
    <Button variant="solid">Save</Button>
  </Panel.Footer>
</Panel>
\`\`\`
        `}}}},v={args:{placement:"right",title:"Panel Title",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({wrapHeaderText:a,...s})=>{const[t,o]=i.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"solid",onClick:()=>o(!0),children:"Open Panel"}),e.jsxs(r,{...s,opened:t,onClose:()=>o(!1),title:"Panel Title",placement:"right",wrapHeaderText:a,children:[e.jsx(c,{children:"This is the panel body content area. Panels slide in from the edge of the screen to reveal supplementary information, navigation options, or toolsets."}),e.jsxs(r.Footer,{children:[e.jsx(n,{variant:"outline",onClick:()=>o(!1),children:"Cancel"}),e.jsx(n,{variant:"solid",children:"Save"})]})]})]})}},C={args:{placement:"left",title:"Navigation",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:a,layer:s,...t})=>{const[o,l]=i.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"outline",onClick:()=>l(!0),children:"Open Left Panel"}),e.jsx(r,{...t,opened:o,onClose:()=>l(!1),children:e.jsx(c,{children:"A panel sliding in from the left, commonly used for navigation menus or sidebars."})})]})}},w={args:{placement:"right",title:"Scrollable Panel",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!1},render:({withLayer:a,layer:s,...t})=>{const[o,l]=i.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"solid",onClick:()=>l(!0),children:"Open Scrollable Panel"}),e.jsxs(r,{...t,opened:o,onClose:()=>l(!1),children:[Array.from({length:20}).map((h,d)=>e.jsxs("p",{style:{marginBottom:"1rem"},children:["Paragraph ",d+1,": This is sample content to demonstrate the scrollable behavior of the panel when content exceeds the viewport height."]},d)),e.jsxs(r.Footer,{children:[e.jsx(n,{variant:"outline",onClick:()=>l(!1),children:"Close"}),e.jsx(n,{variant:"solid",children:"Apply"})]})]})]})}},j={args:{placement:"right",title:"This is a ridiculously long panel title designed to test how the header CSS handles text overflow and whether it truncates correctly or breaks the layout",withOverlay:!0,withCloseButton:!0,wrapHeaderText:!0},render:({...a})=>{const[s,t]=i.useState(!1);return e.jsxs(e.Fragment,{children:[e.jsx(n,{variant:"solid",onClick:()=>t(!0),children:"Open Long Title Panel"}),e.jsx(r,{...a,opened:s,onClose:()=>t(!1),children:e.jsx(c,{children:"Check the header to see if the long title is handled gracefully without pushing the close button off screen."})})]})}},P=["Default","LeftPlacement","ScrollableContent","LongTitle"];export{v as Default,C as LeftPlacement,j as LongTitle,w as ScrollableContent,P as __namedExportsOrder,b as default};
