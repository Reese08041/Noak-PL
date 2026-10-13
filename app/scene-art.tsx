"use client";
import {useEffect,useState} from 'react';
export const scenes=[
 {id:'crossing',alt:'A narrow limestone bridge crossing a mist-filled gorge toward a distant city.',color:'#e0aa88'},
 {id:'observatory',alt:'A brass orrery inside an open stone observatory beneath a sage night sky.',color:'#afc3be'},
 {id:'archive',alt:'A lamp lights a writing table in a monumental stone library.',color:'#d9c7a5'},
 {id:'courtyard',alt:'An arched courtyard with a still reflecting pool at dusk.',color:'#d9a593'},
];
export const pathScene:Record<string,number>={deals:0,private:3,markets:1,banking:0,corporate:2,accounting:2,wealth:3,risk:1,insurance:3,quant:1,'real-assets':0,fintech:2};
export function SceneArt({scene}:{scene:number}){return <div className="scene-aperture">{scenes.map((s,n)=><img key={s.id} className={n===scene?'is-current':''} src={'/'+s.id+'.webp'} alt={n===scene?s.alt:''} aria-hidden={n!==scene} width="900" height="1200" loading="lazy"/>)}</div>}
// Keep the last complete scene on screen until its replacement has decoded.
export function useReadyPath(path:string){const [display,setDisplay]=useState(path);useEffect(()=>{let current=true;const img=new Image();img.src='/'+scenes[pathScene[path]??0].id+'.webp';img.decode().catch(()=>{}).then(()=>{if(current)setDisplay(path)});return()=>{current=false}},[path]);return display}
