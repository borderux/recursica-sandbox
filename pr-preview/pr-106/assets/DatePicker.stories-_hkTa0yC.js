import{j as e}from"./iframe-B16LFdy9.js";import{D as t}from"./DatePicker-CvCk9NIl.js";import{f as r}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-D9Z9MdNV.js";import"./filterStylingProps-jKAwL8FP.js";import"./WithReadOnlyWrapper-BJUacMVx.js";import"./ReadOnlyField-BUjUnQxN.js";import"./adapter-common-4M-aah5E.js";import"./AssistiveElement-CW3jsCUs.js";const p={title:"UI-Kit/DatePicker",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
The \`DatePicker\` primitive provides a unified calendar date selection input integrated directly into the \`FormControlWrapper\` architecture.

### Architectural Decoupling
Recursica overrides the internal Mantine \`DatePickerInput\` wrapper defaults, safely injecting the date picker into our rigid structural layout systems. State modifiers (e.g. Focus, Errors, ReadOnly) hook seamlessly back onto our native CSS mapping architecture.

### Examples
Always structure horizontal architectures via the generic \`formLayout\` parameter.
\`\`\`tsx
<DatePicker 
  label="Start Date" 
  assistiveText="Select the deployment kick-off date." 
  formLayout="stacked" 
/>
\`\`\`
`}}},argTypes:{...r,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."}}},h={args:{disabled:!1,label:"Project Deadline",placeholder:"Select a deadline...",assistiveText:"Specify the absolute cutoff for code submission."}},y={args:{label:"Incident Start Date",placeholder:"Pick date...",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},m={args:{label:"Launch Date",placeholder:"Select launch date...",leftSection:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})}},g={args:{label:"Disabled Date Range",placeholder:"Disabled selection...",disabled:!0}},b={args:{label:"Execution Date",placeholder:"Pick a valid date...",error:"The chosen date conflicts with an existing deployment freeze.",required:!0}},x={args:{label:"Static ReadOnly Review",placeholder:"Ignored...",value:new Date("2026-05-21"),readOnly:!0}},f={args:{label:"Editable ReadOnly Review",placeholder:"Ignored until active...",defaultValue:new Date("2026-06-01"),readOnly:!0,labelWithEditIcon:!0}},D=["Default","FormsSideBySide","WithLeadingIcon","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{h as Default,g as Disabled,f as EditableReadOnly,b as ErrorState,y as FormsSideBySide,x as StaticReadOnly,m as WithLeadingIcon,D as __namedExportsOrder,p as default};
