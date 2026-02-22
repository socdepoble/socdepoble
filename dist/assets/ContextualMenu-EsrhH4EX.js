import{j as t}from"./index-Dj2WQB4W.js";import{c,u as h,N as b}from"./vendor-CLNmR7b8.js";import{P as d}from"./ui-LZNjilA_.js";import"./data-CywEAasM.js";import"./utils-BKcWam9E.js";const v=()=>{const a=c(),l=h(),s=[{id:"xat",label:"XAT",path:"/chats"},{id:"mur",label:"MUR",path:"/mur"},{id:"mercat",label:"MERCAT",path:"/mercat"},{id:"pobles",label:"POBLES",path:"/pobles"}],r={"/chats":[{id:"xat",label:"XAT",path:"/chats"},{id:"gent",label:"GENT",path:"/directori"},{id:"grups",label:"GRUPS",path:"/nexus"},{id:"treball",label:"TREBALL",path:"/ajudes"},{id:"pob",label:"POB",path:"/pobles"}]},o=a.pathname.startsWith("/chats");if(a.pathname.startsWith("/notes"))return null;const i=o?r["/chats"]:s;return t.jsxs("div",{className:"h-12 w-full bg-black border-b border-white/[0.02] flex items-center sticky top-0 z-[900] select-none",children:[t.jsx("div",{className:"flex-1 h-full overflow-x-auto no-scrollbar px-4",children:t.jsx("div",{className:"flex items-center gap-6 lg:gap-10 h-full min-w-max",children:i.map(e=>t.jsx(b,{to:e.path,className:({isActive:n})=>`
                                relative h-full flex items-center text-[11px] font-black tracking-[0.2em] transition-all
                                ${n?'text-[#FF6B00] after:content-[""] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FF6B00]':"text-slate-500 hover:text-white"}
                            `,children:e.label},e.id))})}),t.jsx("div",{className:"flex items-center h-full px-4 bg-black/80 backdrop-blur-md border-l border-white/5 shadow-[-10px_0_15px_rgba(0,0,0,0.5)]",children:t.jsx("button",{onClick:()=>l("/gestio/categories"),className:"w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-slate-400 hover:bg-[#FF6B00] hover:text-white transition-all active:scale-95 shadow-inner",title:"Gestionar Categories",children:t.jsx(d,{size:16,strokeWidth:4})})}),t.jsx("style",{children:`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `})]})};export{v as default};
