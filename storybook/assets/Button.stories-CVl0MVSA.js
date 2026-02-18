import{j as e}from"./iframe-CtlRcG4r.js";import{B as r,L as s}from"./Layer-CGudbwb-.js";import"./preload-helper-D9Z9MdNV.js";import"./index-C-h4Lesk.js";import"./index-qD7xh-i4.js";const b={component:r,title:"UI Kit/Button",decorators:[y=>e.jsx("div",{style:{padding:16},children:e.jsx(y,{})})],argTypes:{variant:{control:"select",options:["solid","outline","text"],description:"Visual style"},size:{control:"select",options:["default","small"],description:"Size"},icon:{control:!1,description:'Leading icon; use "Show icon" to toggle a placeholder'},disabled:{control:"boolean",description:"Disabled state"},children:{control:"text",description:"Button label"}},args:{variant:"solid",size:"default",disabled:!1,children:"Button"}},f=e.jsx("svg",{viewBox:"0 0 16 16",fill:"currentColor","aria-hidden":!0,children:e.jsx("path",{d:"M8 3a.75.75 0 0 1 .75.75v3.5h3.5a.75.75 0 0 1 0 1.5h-3.5v3.5a.75.75 0 0 1-1.5 0v-3.5h-3.5a.75.75 0 0 1 0-1.5h3.5v-3.5A.75.75 0 0 1 8 3Z"})}),a={argTypes:{...b.argTypes,icon:{table:{disable:!0}},showIcon:{control:"boolean",description:"Show leading icon (placeholder)"},layer:{control:"select",options:[0,1,2,3],description:"Layer (0–3) of the wrapping Layer; not a Button prop"}},args:{...b.args,showIcon:!1,layer:0},render:y=>{const{showIcon:x,layer:v=0,...S}=y;return e.jsx(s,{layer:v,style:{padding:16},children:e.jsx(r,{...S,icon:x?f:void 0})})}},o={args:{variant:"solid",size:"default",children:"Solid default"},parameters:{controls:{disable:!0}}},i={args:{variant:"solid",size:"small",children:"Solid small"},parameters:{controls:{disable:!0}}},l={args:{variant:"outline",size:"default",children:"Outline default"},parameters:{controls:{disable:!0}}},d={args:{variant:"outline",size:"small",children:"Outline small"},parameters:{controls:{disable:!0}}},c={args:{variant:"text",size:"default",children:"Text default"},parameters:{controls:{disable:!0}}},u={args:{variant:"text",size:"small",children:"Text small"},parameters:{controls:{disable:!0}}},p={args:{variant:"solid",size:"default",children:"With icon",icon:f},parameters:{controls:{disable:!0}}},m={render:()=>e.jsx(s,{layer:1,style:{padding:16},children:e.jsx(r,{variant:"solid",size:"default",children:"Layer 1 solid"})}),parameters:{controls:{disable:!0}}},h={render:()=>e.jsx(s,{layer:2,style:{padding:16},children:e.jsx(r,{variant:"outline",size:"default",children:"Layer 2 outline"})}),parameters:{controls:{disable:!0}}},g={args:{variant:"solid",size:"default",disabled:!0,children:"Disabled"},parameters:{controls:{disable:!0}}},n={render:()=>e.jsx(s,{layer:0,style:{padding:16},children:e.jsx(r,{variant:"solid",size:"default",icon:f,"aria-label":"Action"})}),parameters:{controls:{disable:!0}}},t={render:()=>e.jsx(s,{layer:0,style:{padding:16},children:e.jsx(r,{variant:"solid",size:"default",children:"This is an example of a button label that is long enough to hit the maximum width constraint of five hundred pixels defined by the design token"})}),parameters:{controls:{disable:!0}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`{
  argTypes: {
    ...meta.argTypes,
    icon: {
      table: {
        disable: true
      }
    },
    showIcon: {
      control: 'boolean',
      description: 'Show leading icon (placeholder)'
    },
    layer: {
      control: 'select',
      options: [0, 1, 2, 3],
      description: 'Layer (0–3) of the wrapping Layer; not a Button prop'
    }
  } as Meta<typeof Button>['argTypes'] & Record<string, unknown>,
  args: {
    ...meta.args,
    showIcon: false,
    layer: 0
  } as typeof meta.args & {
    showIcon?: boolean;
    layer?: 0 | 1 | 2 | 3;
  },
  render: (args: typeof meta.args & {
    showIcon?: boolean;
    layer?: 0 | 1 | 2 | 3;
  }) => {
    const {
      showIcon,
      layer = 0,
      ...rest
    } = args;
    return <Layer layer={layer} style={{
      padding: 16
    }}>
        <Button {...rest} icon={showIcon ? placeholderIcon : undefined} />
      </Layer>;
  }
}`,...a.parameters?.docs?.source},description:{story:"Default story wraps component in Layer; layer control changes the Layer, not the Button.",...a.parameters?.docs?.description}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'solid',
    size: 'default',
    children: 'Solid default'
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...o.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'solid',
    size: 'small',
    children: 'Solid small'
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...i.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    size: 'default',
    children: 'Outline default'
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...l.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'outline',
    size: 'small',
    children: 'Outline small'
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...d.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'text',
    size: 'default',
    children: 'Text default'
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...c.parameters?.docs?.source}}};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'text',
    size: 'small',
    children: 'Text small'
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...u.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'solid',
    size: 'default',
    children: 'With icon',
    icon: placeholderIcon
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...p.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  render: () => <Layer layer={1} style={{
    padding: 16
  }}>
      <Button variant='solid' size='default'>
        Layer 1 solid
      </Button>
    </Layer>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...m.parameters?.docs?.source}}};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => <Layer layer={2} style={{
    padding: 16
  }}>
      <Button variant='outline' size='default'>
        Layer 2 outline
      </Button>
    </Layer>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...h.parameters?.docs?.source}}};g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'solid',
    size: 'default',
    disabled: true,
    children: 'Disabled'
  },
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...g.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`{
  render: () => <Layer layer={0} style={{
    padding: 16
  }}>
      <Button variant='solid' size='default' icon={placeholderIcon} aria-label='Action' />
    </Layer>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...n.parameters?.docs?.source},description:{story:"Min-width: icon-only (no text) so button is at Recursica min-width.",...n.parameters?.docs?.description}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  render: () => <Layer layer={0} style={{
    padding: 16
  }}>
      <Button variant='solid' size='default'>
        This is an example of a button label that is long enough to hit the maximum width constraint
        of five hundred pixels defined by the design token
      </Button>
    </Layer>,
  parameters: {
    controls: {
      disable: true
    }
  }
}`,...t.parameters?.docs?.source},description:{story:"Max-width: long label so button hits Recursica max-width (500px).",...t.parameters?.docs?.description}}};const I=["Default","SolidDefault","SolidSmall","OutlineDefault","OutlineSmall","TextDefault","TextSmall","WithIcon","Layer1Solid","Layer2Outline","Disabled","MinWidth","MaxWidth"];export{a as Default,g as Disabled,m as Layer1Solid,h as Layer2Outline,t as MaxWidth,n as MinWidth,l as OutlineDefault,d as OutlineSmall,o as SolidDefault,i as SolidSmall,c as TextDefault,u as TextSmall,p as WithIcon,I as __namedExportsOrder,b as default};
