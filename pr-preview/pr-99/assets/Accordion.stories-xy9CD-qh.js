import{j as e,A as v,r as g}from"./iframe-B1MJbB4A.js";import"./preload-helper-D9Z9MdNV.js";const S=["className","classNames","style","styles","vars","p","px","py","pt","pb","pl","pr","bg","c","opacity","ff","fz","fw","lts","ta","lh","fs","tt","td","bd","bdw","bds","bdc","bdr","shadow","w","miw","maw","h","mih","mah"],L=new Set(["m","my","mx","mt","mb","ml","mr","gap","rowGap","columnGap","top","left","bottom","right"]),P={"rec-none":"var(--recursica_brand_dimensions_general_none)","rec-sm":"var(--recursica_brand_dimensions_general_sm)","rec-default":"var(--recursica_brand_dimensions_general_default)","rec-md":"var(--recursica_brand_dimensions_general_md)","rec-lg":"var(--recursica_brand_dimensions_general_lg)","rec-xl":"var(--recursica_brand_dimensions_general_xl)","rec-2xl":"var(--recursica_brand_dimensions_general_2xl)"};function A(l,t){if(t)return l;const a={...l};for(const o of S)o in a&&delete a[o];for(const[o,r]of Object.entries(a))typeof r=="string"&&r.startsWith("rec-")&&L.has(o)&&r in P&&(a[o]=P[r]);return a}const V="_root_100di_2",R="_item_100di_32",O="_noDivider_100di_64",E="_control_100di_70",W="_label_100di_150",T="_chevron_100di_158",$="_iconLeftWrapper_100di_185",z="_panel_100di_207",G="_content_100di_216",s={root:V,item:R,noDivider:O,control:E,label:W,chevron:T,iconLeftWrapper:$,panel:z,content:G},j=function({variant:t="unstyled",overStyled:a=!1,...o}){const r=A(o,a),c={root:s.root,item:s.item,control:s.control,label:s.label,chevron:s.chevron,panel:s.panel,content:s.content},i=r.classNames;if(i&&typeof i=="object"&&!Array.isArray(i)){const u=i;Object.keys(u).forEach(d=>{c[d]?c[d]=`${c[d]} ${u[d]}`:c[d]=u[d]})}const m=r.className;return e.jsx(v,{variant:t,className:m,classNames:c,...r})};j.displayName="Accordion";const I=g.forwardRef(function({title:t,leftIcon:a,divider:o=!0,children:r,overStyled:c=!1,...i},m){const u=A(i,c),d=u.className,N=[o?void 0:s.noDivider,d].filter(Boolean).join(" ")||void 0;return e.jsx(v.Item,{ref:m,className:N,...u,children:t?e.jsxs(e.Fragment,{children:[e.jsx(_,{leftIcon:a,children:t}),e.jsx(x,{children:r})]}):r})});I.displayName="AccordionItem";const _=g.forwardRef(function({leftIcon:t,children:a,overStyled:o=!1,...r},c){const i=A(r,o),m=i.className;return e.jsx(v.Control,{ref:c,className:m,icon:t?e.jsx("span",{className:s.iconLeftWrapper,"aria-hidden":!0,children:t}):void 0,...i,children:a})});_.displayName="AccordionControl";const x=g.forwardRef(function({overStyled:t=!1,...a},o){const r=A(a,t),c=r.className;return e.jsx(v.Panel,{ref:o,className:c,...r})});x.displayName="AccordionPanel";const n=j;n.Item=I;n.Control=_;n.Panel=x;I.__docgenInfo={description:"",methods:[],displayName:"AccordionItem",props:{divider:{defaultValue:{value:"true",computed:!1},required:!1},overStyled:{defaultValue:{value:"false",computed:!1},required:!1}}};_.__docgenInfo={description:"",methods:[],displayName:"AccordionControl",props:{overStyled:{defaultValue:{value:"false",computed:!1},required:!1}}};x.__docgenInfo={description:"",methods:[],displayName:"AccordionPanel",props:{overStyled:{defaultValue:{value:"false",computed:!1},required:!1}}};j.__docgenInfo={description:"",methods:[],displayName:"Accordion",props:{variant:{defaultValue:{value:'"unstyled"',computed:!1},required:!1},overStyled:{defaultValue:{value:"false",computed:!1},required:!1}}};const M="_root_1qhn7_3",q="_contents_1qhn7_18",p={root:M,contents:q},b=g.forwardRef(function({layer:l,contentsOnly:t,children:a,className:o,style:r,...c},i){const m=t?o?`${p.root} ${p.contents} ${o}`:`${p.root} ${p.contents}`:o?`${p.root} ${o}`:p.root;return e.jsx("div",{ref:i,className:m,style:r,...t?{}:{"data-recursica-layer":String(l)},...c,children:a})});b.displayName="Layer";const C=()=>e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",strokeLinecap:"round",strokeLinejoin:"round",children:e.jsx("path",{d:"M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"})}),w=()=>e.jsx("svg",{width:"24",height:"24",viewBox:"0 0 24 24",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:e.jsx("path",{d:"M20.0306 9.53062L12.5306 17.0306C12.461 17.1003 12.3783 17.1557 12.2872 17.1934C12.1962 17.2312 12.0986 17.2506 12 17.2506C11.9014 17.2506 11.8038 17.2312 11.7128 17.1934C11.6218 17.1557 11.539 17.1003 11.4694 17.0306L3.96938 9.53062C3.82865 9.38988 3.74959 9.19901 3.74959 8.99999C3.74959 8.80097 3.82865 8.61009 3.96938 8.46936C4.11011 8.32863 4.30098 8.24957 4.50001 8.24957C4.69903 8.24957 4.8899 8.32863 5.03063 8.46936L12 15.4397L18.9694 8.46936C19.0391 8.39968 19.1218 8.34441 19.2128 8.30669C19.3039 8.26898 19.4015 8.24957 19.5 8.24957C19.5986 8.24957 19.6961 8.26898 19.7872 8.30669C19.8782 8.34441 19.9609 8.39968 20.0306 8.46936C20.1003 8.53905 20.1556 8.62177 20.1933 8.71282C20.231 8.80386 20.2504 8.90144 20.2504 8.99999C20.2504 9.09854 20.231 9.19612 20.1933 9.28716C20.1556 9.37821 20.1003 9.46093 20.0306 9.53062Z",fill:"currentColor"})}),k={title:"UI-Kit/Accordion",component:n,tags:["autodocs"],parameters:{docs:{description:{component:"\nThe `Accordion` component intelligently wraps `@mantine/core`'s underlying Accordion layers while applying strict native design system mapping via `recursica_variables_scoped.css`.\n\n### Hybrid Composition API (Smart-Rendering)\nTo maximize flexibility while strictly aligning with the explicit Recursica design logic, the `AccordionItem` operates utilizing a **Hybrid Smart-Rendering Flow**:\n\n1. **Auto-Construction (Explicit Mapping)**:\nIf you supply the explicitly outlined Recursica properties (`title`, `leftIcon`) directly onto `<Accordion.Item>`, the component auto-generates the necessary `<Accordion.Control>` DOM layer inherently bridging the icons and titles visually while leaving the raw `children` wrapped neatly as the `<Accordion.Panel>`.\n\n2. **Graceful Falldown (Raw Composability)**:\nIf you deliberately omit the `title` property, the entire mapping system gracefully falls backward yielding exactly to the raw `@mantine/core` composition model. Under this context, you must inject your localized `<Accordion.Control>` and `<Accordion.Panel>` configurations completely manually.\n\n### Architecture Warning (`open`)\nTo structurally protect the parent wrapper's core transitions tracking architecture (`<Accordion value=\"...\">`), this configuration explicitly rejects mapping isolated `open={true}` object states natively on specific configurations. Use Mantine's inherent sibling arrays matching the corresponding active value map!\n        "}}}},h={render:()=>e.jsx(b,{layer:0,style:{padding:"24px"},children:e.jsxs(n,{defaultValue:"item-1",chevron:e.jsx(w,{}),children:[e.jsxs(n.Item,{value:"item-1",children:[e.jsx(n.Control,{children:"Billing and Membership"}),e.jsx(n.Panel,{children:"You can manage your billing directly from the dashboard tab. All payments are processed automatically."})]}),e.jsxs(n.Item,{value:"item-2",children:[e.jsx(n.Control,{children:"Refund Policy"}),e.jsx(n.Panel,{children:"We offer a 30-day money-back guarantee for all new subscriptions."})]}),e.jsxs(n.Item,{value:"item-3",children:[e.jsx(n.Control,{children:"Technical Support"}),e.jsx(n.Panel,{children:"Our support team is available 24/7 via live chat or email."})]})]})})},y={render:()=>e.jsx(b,{layer:0,style:{padding:"24px"},children:e.jsxs(n,{defaultValue:"security",chevron:e.jsx(w,{}),children:[e.jsxs(n.Item,{value:"security",children:[e.jsx(n.Control,{leftIcon:e.jsx(C,{}),children:"Security Settings"}),e.jsx(n.Panel,{children:"Enable two-factor authentication (2FA) and monitor active sessions below."})]}),e.jsxs(n.Item,{value:"privacy",children:[e.jsx(n.Control,{leftIcon:e.jsx(C,{}),children:"Privacy Configuration"}),e.jsx(n.Panel,{children:"Choose what data is shared with our analytics partners."})]})]})})},f={render:()=>e.jsx(b,{layer:1,style:{padding:"24px"},children:e.jsx(n,{defaultValue:"demo",chevron:e.jsx(w,{}),children:e.jsxs(n.Item,{value:"demo",children:[e.jsx(n.Control,{leftIcon:e.jsx(C,{}),children:"Layer 1 Render Engine"}),e.jsx(n.Panel,{children:'This Accordion dynamically updates its colors, borders, and typography variables because it is wrapped securely by the simulated `data-recursica-layer="1"`.'})]})})})};h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <Layer layer={0} style={{
      padding: "24px"
    }}>
        <Accordion defaultValue="item-1" chevron={<ChevronIcon />}>
          <Accordion.Item value="item-1">
            <Accordion.Control>Billing and Membership</Accordion.Control>
            <Accordion.Panel>
              You can manage your billing directly from the dashboard tab. All
              payments are processed automatically.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="item-2">
            <Accordion.Control>Refund Policy</Accordion.Control>
            <Accordion.Panel>
              We offer a 30-day money-back guarantee for all new subscriptions.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="item-3">
            <Accordion.Control>Technical Support</Accordion.Control>
            <Accordion.Panel>
              Our support team is available 24/7 via live chat or email.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Layer>;
  }
}`,...h.parameters?.docs?.source}}};y.parameters={...y.parameters,docs:{...y.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <Layer layer={0} style={{
      padding: "24px"
    }}>
        <Accordion defaultValue="security" chevron={<ChevronIcon />}>
          <Accordion.Item value="security">
            <Accordion.Control leftIcon={<SVGIcon />}>
              Security Settings
            </Accordion.Control>
            <Accordion.Panel>
              Enable two-factor authentication (2FA) and monitor active sessions
              below.
            </Accordion.Panel>
          </Accordion.Item>

          <Accordion.Item value="privacy">
            <Accordion.Control leftIcon={<SVGIcon />}>
              Privacy Configuration
            </Accordion.Control>
            <Accordion.Panel>
              Choose what data is shared with our analytics partners.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Layer>;
  }
}`,...y.parameters?.docs?.source}}};f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => {
    return <Layer layer={1} style={{
      padding: "24px"
    }}>
        <Accordion defaultValue="demo" chevron={<ChevronIcon />}>
          <Accordion.Item value="demo">
            <Accordion.Control leftIcon={<SVGIcon />}>
              Layer 1 Render Engine
            </Accordion.Control>
            <Accordion.Panel>
              This Accordion dynamically updates its colors, borders, and
              typography variables because it is wrapped securely by the
              simulated \`data-recursica-layer="1"\`.
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Layer>;
  }
}`,...f.parameters?.docs?.source}}};const F=["Default","WithIcons","LayerOne"];export{h as Default,f as LayerOne,y as WithIcons,F as __namedExportsOrder,k as default};
