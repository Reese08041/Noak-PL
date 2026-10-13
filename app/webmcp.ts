"use client";
import {useEffect} from 'react';
import {filterJobs,type Filters} from '@/lib/filter';
import type {Opportunity} from '@/lib/catalog';
export function useFinanceTools(jobs:Opportunity[],filters:Filters,update:(f:Filters)=>void,navigate:(v:string)=>void){useEffect(()=>{
 const context=(document as any).modelContext;if(!context?.registerTool)return;const lifecycle=new AbortController();
 const tool={name:'configure_opportunity_search',title:'Filter finance opportunities',description:'Set the visible search query and optionally the finance function. Opens Opportunities; does not save records or submit applications.',inputSchema:{type:'object',properties:{query:{type:'string',maxLength:150},financeFunction:{type:'string',maxLength:80}},required:['query'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:true},async execute(input:any){if(!input||typeof input.query!=='string'||input.query.length>150||Object.keys(input).some(k=>!['query','financeFunction'].includes(k))||(input.financeFunction!==undefined&&typeof input.financeFunction!=='string'))throw Error('Invalid search input');const next={...filters,q:input.query,...(input.financeFunction?{function:input.financeFunction}:{})};update(next);navigate('opportunities');await new Promise(r=>setTimeout(r,0));return {matchingCount:filterJobs(jobs,next).length,query:next.q,financeFunction:next.function};}};
 try{Promise.resolve(context.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}return()=>lifecycle.abort();
 },[jobs,filters,update,navigate]);}
