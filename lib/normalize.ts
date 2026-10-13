import type {Opportunity,SourceConfig} from './catalog';
export function textContent(input:string):string{
 let text=input.replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#(?:39|x27);/g,"'").replace(/&amp;/g,'&');
 text=text.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<\/(?:p|div|li|h[1-6]|tr)>|<br\s*\/?>/gi,'\n').replace(/<[^>]+>/g,'');
 return text.replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(Math.min(Number(n),0x10ffff))).replace(/[ \t]+/g,' ').replace(/\n\s*\n/g,'\n').trim();
}
const rules:[string,RegExp][]=[['Investment banking',/investment bank/i],['M&A',/m&a|mergers|acquisition/i],['Capital markets',/capital markets|debt capital|equity capital/i],['Restructuring',/restructur|distressed/i],['Valuation',/valuation/i],['Private equity',/private equity|pe.secondar/i],['Venture capital',/venture capital/i],['Private credit',/private credit|direct lend/i],['Hedge funds',/hedge fund|absolute return|\bARS\b/i],['Asset management',/portfolio|asset manag|investment associate|investment intern/i],['Investment research',/investment research|equity research|research analyst/i],['Sales & trading',/trad(er|ing)|sales.*(equities|fixed income)/i],['Quantitative finance',/quant|systematic|investment engineer/i],['Wealth management',/wealth|financial advis/i],['Private banking',/private bank/i],['Commercial banking',/commercial bank|loan|lending|credit analyst|credit intern/i],['Corporate banking',/corporate bank/i],['Corporate finance',/finance|financial analyst|financial planning/i],['FP&A',/fp&a|financial planning|budget/i],['Treasury',/treasur/i],['Transaction advisory',/transaction advis|due diligence/i],['Accounting',/account|audit|tax |controller/i],['Risk',/risk/i],['Compliance',/compliance|anti.money|\bAML\b/i],['Insurance',/insurance|underwrit/i],['Actuarial',/actuar/i],['Payments',/payments/i],['Real estate finance',/real estate/i],['Infrastructure finance',/infrastructure invest/i],['Public-sector finance',/public finance|municipal/i]];
export function classify(title:string){if(/(?:security|cybersecurity|information|technology) risk|security compliance/i.test(title)&&!/financial|credit|market risk/i.test(title))return [];return rules.filter(([,r])=>r.test(title)).map(([name])=>name);}
export function classifyProgram(title:string,description:string):string{
 const t=title.toLowerCase();
 if(/pre.?intern/.test(t))return 'Pre-internship';if(/spring week/.test(t))return 'Spring week';if(/discovery day/.test(t))return 'Discovery day';if(/insight|discovery program/.test(t))return 'Insight program';if(/apprentic/.test(t))return 'Apprenticeship';if(/placement/.test(t))return 'Placement';if(/off.?cycle/.test(t))return 'Off-cycle internship';if(/\bintern(?:ship)?s?\b/.test(t))return /summer/i.test(title+' '+description)?'Summer internship':'Internship';if(/rotation/.test(t))return 'Rotational program';if(/graduate (program|scheme)|new grad/.test(t))return 'Graduate scheme';return 'Full-time';
}
export function parseGraduationYears(lines:string[]):number[]{
 const years=new Set<number>();
 for(const line of lines){if(!/graduat(?:e|ion|ing|ion date)/i.test(line)||line.length>600)continue;
 // Do not infer a graduation year from an internship year or vague class standing.
 if(/graduate (degree|school|student)|postgraduate/i.test(line)&&!/graduat(?:ing|ion date)/i.test(line))continue;
 const clause=line.match(/\bgraduat(?:ion(?:\s+(?:date|year))?|ing|e|ed)\b\s*[:–-]?\s*([^.!?;]{0,110})/i)?.[1]??'';
 const found=[...clause.matchAll(/\b20[2-4]\d\b/g)].map(m=>Number(m[0]));
 if(found.length===2&&/between|through| to |[-–]/i.test(line)&&found[1]>=found[0]&&found[1]-found[0]<=4){for(let y=found[0];y<=found[1];y++)years.add(y);}else if(found.length<=3)found.forEach(y=>years.add(y));
 }return [...years].sort();
}
export function locationParts(location:string):{country:string;city:string}{
 const us=/United States|\bUSA\b|\bU\.S\.|New York|Chicago|Boston|Philadelphia|Pittsburgh|Greenwich|Westport|Minneapolis|San Francisco|Menlo Park|Washington|Winchester|El Segundo|Seattle|Miami|Austin|Dallas|Houston|Charlotte|Los Angeles|Denver|Atlanta|Newport Beach|Boca Raton|California|Illinois|Minnesota|Wisconsin|Virginia|Pennsylvania|Connecticut|New Jersey|Texas|Florida|Massachusetts|\b(?:NY|CA|IL|MN|WI|VA|PA|CT|NJ|TX|FL|MA|DC|CO|NC|WA|AZ|GA|UT|OH|MI|NE|IA)\b/i;
 const country=/London|United Kingdom|\bUK\b/i.test(location)?'United Kingdom':/Geneva|Zurich|Switzerland/i.test(location)?'Switzerland':/Toronto|Canada|Vancouver/i.test(location)?'Canada':/Singapore/i.test(location)?'Singapore':us.test(location)?'United States':'Unknown';
 return {country,city:location.split(/[;,]/)[0].replace(/^[A-Z]{2}-/,'').trim()};
}
export function normalize(job:any,source:SourceConfig,now:string):Opportunity|null{
 if(!job||!job.id||typeof job.title!=='string'||typeof job.content!=='string')throw Error('Invalid job record');
 const title=job.title.trim();const tags=classify(title);if(!tags.length)return null;
 const description=textContent(job.content);const lines=description.split('\n').map(x=>x.trim()).filter(Boolean);
 const eligibility=lines.filter(x=>/graduat|bachelor|master|degree|enroll|sophomore|junior|senior year|freshman|GPA|eligible|eligibility|citizen|authoriz|sponsor|visa|years? of (?:relevant |professional )?experience|must (?:be|have)|required|qualification|minimum|women|underrepresented|veteran|disabilit/i.test(x));
 const program=classifyProgram(title,description);
 const cycle=title.match(/\b20\d{2}\b/)?.[0]??'undated';
 const canonicalKey=source.id+':'+String(job.internal_job_id??job.id)+':'+cycle;
 let link:URL;try{link=new URL(job.absolute_url)}catch{throw Error('Invalid application URL')}
 if(link.protocol!=='https:'||!['job-boards.greenhouse.io','boards.greenhouse.io','job-boards.eu.greenhouse.io'].includes(link.hostname)||!link.pathname.startsWith('/'+source.id+'/jobs/'))throw Error('Untrusted application URL');
 link.search='';
 const deadlineRaw=typeof job.application_deadline==='string'?job.application_deadline:null;
 const deadline=deadlineRaw&&!Number.isNaN(Date.parse(deadlineRaw))?deadlineRaw:null;
 const deadlineLines=lines.filter(x=>/application deadline|apply (?:by|before)|applications? (?:close|due)|rolling (?:basis|admissions|applications)/i.test(x));
 const publishedAt=typeof job.first_published==='string'&&!Number.isNaN(Date.parse(job.first_published))?job.first_published:null;
 return {id:canonicalKey,canonicalKey,sourceId:source.id,sourceJobId:String(job.id),employer:source.employer,industry:source.industry,title,functions:tags,program,experience:/intern|insight|week|placement|apprentice/i.test(program)?'Student':/senior|lead|director|head|principal|vice president|manager/i.test(title)?'Experienced':/analyst|associate|graduate|junior/i.test(title)?'Early career':'Not specified',location:job.location?.name||'Not provided',...locationParts(job.location?.name||''),applicationUrl:link.href,sourceUrl:link.href,publishedAt,firstDiscovered:now,lastVerified:now,deadline,deadlineTimezone:deadline?.match(/(?:Z|[+-]\d\d:\d\d)$/)?.[0]??null,deadlineText:deadline??(deadlineLines.length?deadlineLines.join('\n'):'Not provided'),programDates:lines.filter(x=>/(?:summer|winter|spring|fall|autumn) 20\d{2}|\b(?:May|June|July|August|September)\s+\d|\d+[-– ]week (?:summer |internship |program)/i.test(x)),eligibility,graduationYears:parseGraduationYears(eligibility),compensation:lines.filter(x=>/(?:\$[\d,.]+|USD\s*[\d,]+|salary range|hourly rate|base (?:pay|salary))/i.test(x)),sponsorship:lines.filter(x=>/sponsor|visa|work authoriz|legally authorized|citizenship/i.test(x)),description,cycle,status:deadline&&Date.parse(deadline)<Date.parse(now)?'closed':'open',missingCount:0,missingSince:null};
}
