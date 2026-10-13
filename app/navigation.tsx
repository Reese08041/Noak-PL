"use client";
import {useEffect,useRef,useState,type ReactNode} from 'react';
export function PersistView({active,name,children}:{active:boolean;name:string;children:ReactNode}){const visited=useRef(active);if(active)visited.current=true;return visited.current?<section className="view-panel" data-view={name} hidden={!active} aria-hidden={!active}>{children}</section>:null}
export function NavIndicator({view}:{view:string}){const marker=useRef<HTMLSpanElement>(null);const [box,setBox]=useState({x:0,y:0,width:0});useEffect(()=>{const nav=marker.current?.parentElement;if(!nav)return;const measure=()=>{const a=nav.querySelector<HTMLElement>('[aria-current]');if(a)setBox({x:a.offsetLeft,y:a.offsetTop+a.offsetHeight-3,width:a.offsetWidth});else setBox(b=>({...b,width:0}))};measure();const observer=new ResizeObserver(measure);observer.observe(nav);document.fonts.ready.then(measure);return()=>observer.disconnect()},[view]);return <span ref={marker} className="nav-marker" aria-hidden="true" style={{transform:`translate(${box.x}px,${box.y}px)`,width:box.width}}/>}


type NavigationProps={view:string;navigate:(view:string)=>void};
const groups=[
 {id:'home',label:'Explore',views:['home']},
 {id:'opportunities',label:'Opportunities',views:['opportunities','applications']},
 {id:'sprint',label:'Prepare',views:['sprint','technical','behavioral']},
 {id:'networking',label:'Network',views:['networking']}
];
export function PrimaryNavigation({view,navigate}:NavigationProps){
 return <nav className="primary-navigation" aria-label="Main navigation"><NavIndicator view={view}/>{groups.map(group=>{
 const active=group.views.includes(view);
 return <a key={group.id} className={active?'active':''} aria-current={active?(view===group.id?'page':'location'):undefined} href={'?view='+group.id} onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate(group.id)}}>{group.label}</a>
 })}</nav>
}
export function SectionNavigation({view,navigate,applications}:NavigationProps&{applications:number}){
 const group=groups.find(group=>group.views.includes(view));
 const links=group?.id==='sprint'?[['sprint','My plan'],['technical','Technical practice'],['behavioral','My stories']]:group?.id==='opportunities'?[['opportunities','Find roles'],['applications','Applications']]:[];
 if(!links.length)return null;
 return <div className="section-navigation-shell"><nav className="section-navigation" aria-label={group!.label+' navigation'}><NavIndicator view={view}/>{links.map(([id,label])=><a key={id} href={'?view='+id} className={view===id?'active':''} aria-current={view===id?'page':undefined} onClick={e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();navigate(id)}}>{label}{id==='applications'&&applications>0&&<span className="nav-count">{applications}</span>}</a>)}</nav></div>
}
