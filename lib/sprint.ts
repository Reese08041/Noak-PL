import {tracks} from './learning';
export const blankSprint={jobId:'',sourceExcerpt:'',track:'deals',target:'',requirement:'',story:'',contact:'',proof:'',question:'',done:[false,false,false]};
export function validSprint(d:any){return !!d&&['jobId','sourceExcerpt'].every(k=>d[k]===undefined||(typeof d[k]==='string'&&d[k].length<=5000))&&tracks.some(t=>t.id===d.track)&&['target','requirement','story','contact','proof','question'].every(k=>typeof d[k]==='string'&&d[k].length<=5000)&&Array.isArray(d.done)&&d.done.length===3&&d.done.every((v:unknown)=>typeof v==='boolean');}
