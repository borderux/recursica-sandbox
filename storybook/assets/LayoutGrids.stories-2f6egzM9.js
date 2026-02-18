import{j as l}from"./iframe-UF0dZ-sR.js";import{b as j}from"./recursica_brand-D0KAEj_W.js";import{t as E}from"./recursica_tokens-B2QFqZbk.js";import"./preload-helper-D9Z9MdNV.js";const x=/^\{([^}]+)\}$/;function b(t,s){const e=s.split(".");let o=t;for(const r of e){if(o==null||typeof o!="object")return;o=o[r]}return o}function h(t,s,e=0){if(e>5)return t;const o=t.trim().match(x);if(!o)return t;const r=o[1];let n=b(s,r);if(n==null){const a=r.replace(/\.size\./,".sizes.");n=b(s,a)}if(n!=null&&typeof n=="object"&&"$value"in n){const a=n.$value;if(typeof a=="string"&&x.test(a))return h(a,s,e+1)}return n}function T(t){if(t==null||typeof t!="object")return null;const e=t.$value;if(e!=null&&typeof e=="object"&&"value"in e&&"unit"in e){const o=e;if(o.unit==="px")return o.value}return typeof e=="number"?e:null}const $=JSON.parse(j),O=JSON.parse(E),_={...O,brand:$.brand};function k(){const t=$.brand?.["layout-grids"];return!t||typeof t!="object"?[]:Object.entries(t).filter(([s])=>!s.startsWith("$")).filter(([,s])=>s&&typeof s=="object").map(([s,e])=>{const o=e["max-width"],r=o?.$value!=null&&typeof o.$value=="number"?o.$value:800,n=e.columns,a=n?.$value!=null&&typeof n.$value=="number"?n.$value:6;let g=16;const y=e.gutter?.$value;if(typeof y=="string"&&x.test(y)){const P=h(y,_),v=T(P);v!=null&&(g=v)}return{name:s,maxWidthPx:r,columns:a,gutterPx:g}})}const f=k(),c=f.find(t=>t.name==="desktop"),d=f.find(t=>t.name==="tablet"),m=f.find(t=>t.name==="mobile"),i=c?.maxWidthPx??1280,p=d?.maxWidthPx??810,R=m?.maxWidthPx??480;function w(){const t=c?.columns??6,s=c?.gutterPx??16,e=d?.columns??6,o=d?.gutterPx??16,r=m?.columns??4,n=m?.gutterPx??16;return`
    .layout-grids-responsive-demo {
      display: grid;
      grid-template-columns: repeat(var(--layout-cols), 1fr);
      gap: var(--layout-gutter);
      max-width: var(--layout-max-width);
      margin: 0 auto;
    }
    /* Mobile: default (< 810px) */
    .layout-grids-responsive-demo {
      --layout-cols: ${r};
      --layout-gutter: ${n}px;
      --layout-max-width: ${R}px;
    }
    /* Tablet: 810px to < 1280px */
    @media (min-width: ${p}px) and (max-width: ${i-1}px) {
      .layout-grids-responsive-demo {
        --layout-cols: ${e};
        --layout-gutter: ${o}px;
        --layout-max-width: ${p}px;
      }
    }
    /* Desktop: 1280px and above */
    @media (min-width: ${i}px) {
      .layout-grids-responsive-demo {
        --layout-cols: ${t};
        --layout-gutter: ${s}px;
        --layout-max-width: ${i}px;
      }
    }
  `}function C(){if(f.length===0)return l.jsx("div",{style:{padding:24,fontFamily:"system-ui, sans-serif"},children:"No layout grids found in brand."});const t=c?.columns??6,s=d?.columns??6,e=m?.columns??4,o=Math.max(t*2,s*2,e*2);return l.jsxs("div",{style:{padding:24,fontFamily:"system-ui, sans-serif",display:"flex",flexDirection:"column",gap:24},children:[l.jsx("style",{dangerouslySetInnerHTML:{__html:w()}}),l.jsxs("p",{style:{margin:0,fontSize:14,color:"#666"},children:["One responsive grid: desktop ≥",i,"px (",t," cols), tablet"," ",p,"–",i-1,"px (",s," cols), mobile <",p,"px (",e," cols). Resize the viewport to see the grid change."]}),l.jsx("div",{className:"layout-grids-responsive-demo",children:Array.from({length:o},(r,n)=>l.jsx("div",{style:{minHeight:48,backgroundColor:"rgba(0,0,0,0.08)",borderRadius:4,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#666"},children:n+1},n))})]})}const N={title:"Theme/Layout Grids",parameters:{layout:"padded"},tags:["autodocs"]},u={render:()=>l.jsx(C,{})};u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <LayoutGridsStory />
}`,...u.parameters?.docs?.source}}};const A=["Default"];export{u as Default,A as __namedExportsOrder,N as default};
