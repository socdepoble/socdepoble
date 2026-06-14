// src/hooks/useNavigationPredictor.js
import {useEffect,useRef} from 'react';
export const useNavigationPredictor = () => {
  const p=useRef([]),f=useRef(new Set());
  useEffect(()=>{
    let t;
    const m=(e)=>{
      clearTimeout(t);
      t=setTimeout(()=>{
        const {clientX:x,clientY:y}=e;
        p.current.push({x,y,t:Date.now()});
        if(p.current.length>3)p.current.shift();
        if(p.current.length===3){
          const [a,,c]=p.current,dx=c.x-a.x,dy=c.y-a.y,dt=c.t-a.t;
          if(dt<200&&(Math.abs(dx)>5||Math.abs(dy)>5)){
            const s=Math.sqrt(dx*dx+dy*dy)/dt;
            if(s>0.3){
              const fx=c.x+dx*0.1,fy=c.y+dy*0.1;
              document.elementsFromPoint?.(fx,fy).forEach(el=>{
                const id=el.getAttribute('data-prefetch-id');
                if(id&&!f.current.has(id)){
                  f.current.add(id);
                  el.hasAttribute('data-prefetch-component')&&import(`./components/${id}.jsx`).catch(()=>{});
                  el.hasAttribute('data-prefetch-api')&&fetch(el.getAttribute('data-prefetch-api')).catch(()=>{});
                }
              });
            }
          }
        }
      },16);
    };
    window.addEventListener('mousemove',m,{passive:true});
    return()=>window.removeEventListener('mousemove',m);
  },[]);
};
