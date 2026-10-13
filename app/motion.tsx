"use client";
import {useEffect,useState} from 'react';
export type MotionMode='system'|'full'|'reduce';
export function useMotion(view:string){
 const [mode,setMode]=useState<MotionMode>('system'),[systemReduced,setSystemReduced]=useState(true),[visible,setVisible]=useState(true);
 useEffect(()=>{
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  const sync=()=>setSystemReduced(media.matches),visibility=()=>setVisible(!document.hidden);
  sync();visibility();
  try{const saved=localStorage.getItem('noakpl-motion');if(saved==='full'||saved==='reduce')setMode(saved)}catch{}
  media.addEventListener('change',sync);document.addEventListener('visibilitychange',visibility);
  return()=>{media.removeEventListener('change',sync);document.removeEventListener('visibilitychange',visibility)};
 },[]);
 useEffect(()=>{
  const observer=new IntersectionObserver(entries=>{for(const entry of entries)(entry.target as HTMLElement).dataset.inView=String(entry.isIntersecting)},{rootMargin:'60px'});
  const elements=document.querySelectorAll('.view-panel:not([hidden]) .threshold,.view-panel:not([hidden]) .career-exhibit,.view-panel:not([hidden]) .personal-cover');
  elements.forEach(el=>observer.observe(el));return()=>observer.disconnect();
 },[view]);
 function change(value:MotionMode){setMode(value);try{localStorage.setItem('noakpl-motion',value)}catch{}}
 return {mode,change,enabled:mode==='full'||(mode==='system'&&!systemReduced),visible};
}
