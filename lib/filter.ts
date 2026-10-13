import type {Opportunity} from './catalog';
export type Filters={q:string;function:string;industry:string;employer:string;country:string;city:string;program:string;experience:string;graduation:string;unknown:boolean;deadline:string;discovered:string;status:string;sort:string};
export const defaultFilters:Filters={q:'',function:'all',industry:'all',employer:'all',country:'United States',city:'all',program:'all',experience:'Student',graduation:'2029',unknown:true,deadline:'all',discovered:'all',status:'open',sort:'discovered'};
export function filterJobs(jobs:Opportunity[],f:Filters,now=Date.now()){
 return jobs.filter(j=>{
  if(f.q&&!(j.title+' '+j.employer+' '+j.location+' '+j.functions.join(' ')).toLowerCase().includes(f.q.toLowerCase()))return false;
  if(f.function!=='all'&&!j.functions.includes(f.function))return false;
  for(const key of ['industry','employer','country','city','program','experience','status'] as const)if(f[key]!=='all'&&j[key]!==f[key])return false;
  if(f.graduation!=='all'&&(j.graduationYears.length?!j.graduationYears.includes(Number(f.graduation)):!f.unknown))return false;
  if(f.deadline==='unknown'&&j.deadlineText!=='Not provided')return false;
  if(f.deadline==='rolling'&&!/rolling/i.test(j.deadlineText))return false;
  if(['7','30'].includes(f.deadline)&&(!j.deadline||Date.parse(j.deadline)<now||Date.parse(j.deadline)>now+Number(f.deadline)*86400000))return false;
  if(f.discovered!=='all'&&Date.parse(j.firstDiscovered)<now-Number(f.discovered)*86400000)return false;
  return true;
 }).sort((a,b)=>f.sort==='deadline'?(a.deadline?Date.parse(a.deadline):Infinity)-(b.deadline?Date.parse(b.deadline):Infinity)||Date.parse(b.firstDiscovered)-Date.parse(a.firstDiscovered):f.sort==='posted'?Date.parse(b.publishedAt??'1970-01-01')-Date.parse(a.publishedAt??'1970-01-01'):Date.parse(b.firstDiscovered)-Date.parse(a.firstDiscovered)||a.employer.localeCompare(b.employer));
}
