import{j as e}from"./iframe-BNcMP74i.js";import{L as a,B as s}from"./Layer-TKbCnfZb.js";import"./preload-helper-D9Z9MdNV.js";import"./index-Dhze0EPq.js";import"./index-Cr7VMBo0.js";const n={padding:20},g={component:a,title:"UI Kit/Layer",argTypes:{layer:{control:"select",options:[0,1,2,3],description:"Layer (0–3) applied to descendants via data-recursica-layer"},children:{control:!1,description:"Content that receives the layer context"}},args:{layer:1,children:null}},t={render:()=>e.jsxs("div",{style:{display:"flex",gap:16,flexWrap:"wrap"},children:[e.jsx(a,{layer:0,style:n,children:e.jsx(s,{children:"Layer 0"})}),e.jsx(a,{layer:1,style:n,children:e.jsx(s,{children:"Layer 1"})}),e.jsx(a,{layer:2,style:n,children:e.jsx(s,{children:"Layer 2"})}),e.jsx(a,{layer:3,style:n,children:e.jsx(s,{children:"Layer 3"})})]}),parameters:{controls:{disable:!0}}},l={render:r=>e.jsx(a,{...r,style:n,children:e.jsxs(s,{children:["Button in layer ",r.layer]})})},o={args:{layer:0},render:r=>e.jsx(a,{...r,style:n,children:e.jsx(s,{children:"Layer 0"})}),parameters:{controls:{disable:!0}}},y={args:{layer:1},render:r=>e.jsx(a,{...r,style:n,children:e.jsx(s,{children:"Layer 1"})}),parameters:{controls:{disable:!0}}},c={args:{layer:2},render:r=>e.jsx(a,{...r,style:n,children:e.jsx(s,{children:"Layer 2"})}),parameters:{controls:{disable:!0}}},d={args:{layer:3},render:r=>e.jsx(a,{...r,style:n,children:e.jsx(s,{children:"Layer 3"})}),parameters:{controls:{disable:!0}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    display: 'flex',
    gap: 16,
    flexWrap: 'wrap'
  }}>
      <Layer layer={0} style={layerStyle}>
        <Button>Layer 0</Button>
      </Layer>
      <Layer layer={1} style={layerStyle}>
        <Button>Layer 1</Button>
      </Layer>
      <Layer layer={2} style={layerStyle}>
        <Button>Layer 2</Button>
      </Layer>
      <Layer layer={3} style={layerStyle}>
        <Button>Layer 3</Button>
      </Layer>
    </div>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...t.parameters?.docs?.source},description:{story:"All four layers side by side.",...t.parameters?.docs?.description}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  render: args => <Layer {...args} style={layerStyle}>
      <Button>Button in layer {args.layer}</Button>
    </Layer>
}`,...l.parameters?.docs?.source},description:{story:"Playground: change layer to see Button (and other descendants) use that layer's styles.",...l.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    layer: 0
  },
  render: args => <Layer {...args} style={layerStyle}>
      <Button>Layer 0</Button>
    </Layer>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...o.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  args: {
    layer: 1
  },
  render: args => <Layer {...args} style={layerStyle}>
      <Button>Layer 1</Button>
    </Layer>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...y.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    layer: 2
  },
  render: args => <Layer {...args} style={layerStyle}>
      <Button>Layer 2</Button>
    </Layer>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...c.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    layer: 3
  },
  render: args => <Layer {...args} style={layerStyle}>
      <Button>Layer 3</Button>
    </Layer>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...d.parameters?.docs?.source}}};const x=["Default","SingleLayer","Layer0","Layer1","Layer2","Layer3"];export{t as Default,o as Layer0,y as Layer1,c as Layer2,d as Layer3,l as SingleLayer,x as __namedExportsOrder,g as default};
