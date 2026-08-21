import{j as e}from"./iframe-B2rOdtrB.js";import{D as t}from"./DatePicker-Ci0vG8ie.js";import{f as r}from"./commonArgTypes-DcjzA9l3.js";import"./preload-helper-D9Z9MdNV.js";import"./filterStylingProps-Dc62mC8D.js";import"./WithReadOnlyWrapper-BK_M24Ap.js";import"./FormControlWrapper-CnLm8scJ.js";import"./AssistiveElement-BbPKX7qK.js";import"./ReadOnlyField-CMUFMCkH.js";const p={title:"UI-Kit/DatePicker",component:t,tags:["autodocs"],parameters:{docs:{description:{component:`
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
`}}},argTypes:{...r,disabled:{control:"boolean",description:"Maps the formal disabled variable states structurally to the input core."},error:{control:"text",description:"Applies the strict error string boundary rendering invalid structures seamlessly."},required:{control:"boolean"},label:{control:"text"},assistiveText:{control:"text"},readOnly:{control:"boolean",description:"Toggles structural read-only data presentation explicitly blocking standard component bindings."}}},y={args:{disabled:!1,label:"Project Deadline",assistiveText:"Specify the absolute cutoff for code submission."}},m={args:{label:"Incident Start Date",assistiveText:"When did the incident originally occur?",formLayout:"side-by-side"}},h={args:{label:"Launch Date",leftSection:e.jsxs("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:[e.jsx("rect",{x:"3",y:"4",width:"18",height:"18",rx:"2",ry:"2"}),e.jsx("line",{x1:"16",y1:"2",x2:"16",y2:"6"}),e.jsx("line",{x1:"8",y1:"2",x2:"8",y2:"6"}),e.jsx("line",{x1:"3",y1:"10",x2:"21",y2:"10"})]})}},b={args:{label:"Disabled Date Range",disabled:!0}},g={args:{label:"Execution Date",error:"The chosen date conflicts with an existing deployment freeze.",required:!0}},x={args:{label:"Static ReadOnly Review",value:new Date("2026-05-21"),readOnly:!0}},f={args:{label:"Editable ReadOnly Review",defaultValue:new Date("2026-06-01"),readOnly:!0,labelWithEditIcon:!0}},D=["Default","FormsSideBySide","WithLeadingIcon","Disabled","ErrorState","StaticReadOnly","EditableReadOnly"];export{y as Default,b as Disabled,f as EditableReadOnly,g as ErrorState,m as FormsSideBySide,x as StaticReadOnly,h as WithLeadingIcon,D as __namedExportsOrder,p as default};
