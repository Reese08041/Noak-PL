import {sources,type SourceConfig,type Opportunity} from './catalog';
import {normalize} from './normalize';
export type Fetcher=(input:string,init?:RequestInit)=>Promise<Response>;
export async function refreshSource(db:D1Database,source:SourceConfig,fetcher:Fetcher=fetch,now=new Date().toISOString()){
 const token=crypto.randomUUID();const runId=crypto.randomUUID();
 const lock=await db.prepare('INSERT INTO refresh_locks(id,expires_at,token) VALUES(?,?,?) ON CONFLICT(id) DO UPDATE SET expires_at=excluded.expires_at,token=excluded.token WHERE refresh_locks.expires_at < ?').bind(source.id,new Date(Date.parse(now)+120000).toISOString(),token,now).run();
 if(!lock.meta.changes)return {source:source.id,skipped:true,reason:'Refresh already running'};
 try{
  const previous=await db.prepare('SELECT last_success FROM source_checks WHERE id=?').bind(source.id).first<any>();
  if(previous?.last_success&&Date.parse(now)-Date.parse(previous.last_success)<15*60*1000)return {source:source.id,skipped:true,reason:'Checked within 15 minutes'};
  await db.prepare('INSERT INTO ingestion_runs(id,started_at,status,summary) VALUES(?,?,?,?)').bind(runId,now,'running',JSON.stringify({source:source.id})).run();
  const endpoint=`https://boards-api.greenhouse.io/v1/boards/${source.id}/jobs?content=true`;
  const response=await fetcher(endpoint,{headers:{Accept:'application/json','User-Agent':'NoakPL/1.0 (public job board reader)'},signal:AbortSignal.timeout(20000),redirect:'manual'});
  if(!response.ok)throw Error(`HTTP ${response.status}${response.status===429?' — rate limited; next scheduled check will retry':''}`);
  const data:any=await response.json();
  if(!Array.isArray(data.jobs)||!Number.isInteger(data.meta?.total)||data.meta.total!==data.jobs.length)throw Error('Incomplete or unexpected feed; no listings were removed');
  const byKey=new Map<string,Opportunity>();const allIds=new Set(data.jobs.map((j:any)=>String(j.id)));
  for(const job of data.jobs){const item=normalize(job,source,now);if(item&&!byKey.has(item.id))byKey.set(item.id,item);}
  const existing=(await db.prepare('SELECT payload FROM opportunities WHERE source_id=?').bind(source.id).all<any>()).results.map(r=>JSON.parse(r.payload) as Opportunity);
  const old=new Map(existing.map(j=>[j.id,j]));const changes:Opportunity[]=[];
  for(const [id,item] of byKey){const prior=old.get(id);if(prior)item.firstDiscovered=prior.firstDiscovered;changes.push(item);}
  for(const item of existing){if(byKey.has(item.id)||item.status==='closed')continue;
   // A title reclassification must not be mistaken for removal from the source.
   if(allIds.has(item.sourceJobId))continue;
   item.missingCount+=1;item.missingSince??=now;
   item.status=item.missingCount>=2&&Date.parse(now)-Date.parse(item.missingSince)>=86400000?'closed':'unverified';changes.push(item);
  }
  // Atomic per-source update. Failed fetches/parses never change opportunity rows.
  const statements=changes.map(j=>db.prepare('INSERT INTO opportunities(id,source_id,status,first_discovered,last_verified,payload) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET status=excluded.status,last_verified=excluded.last_verified,payload=excluded.payload').bind(j.id,j.sourceId,j.status,j.firstDiscovered,j.lastVerified,JSON.stringify(j)));
  statements.push(db.prepare('INSERT INTO source_checks(id,last_attempt,last_success,last_error,job_count,failures) VALUES(?,?,?,NULL,?,0) ON CONFLICT(id) DO UPDATE SET last_attempt=excluded.last_attempt,last_success=excluded.last_success,last_error=NULL,job_count=excluded.job_count,failures=0').bind(source.id,now,now,byKey.size));
  const summary={source:source.id,providerCount:data.jobs.length,financeCount:byKey.size,newCount:[...byKey.keys()].filter(k=>!old.has(k)).length};
  statements.push(db.prepare('UPDATE ingestion_runs SET finished_at=?,status=?,summary=? WHERE id=?').bind(new Date().toISOString(),'success',JSON.stringify(summary),runId));
  await db.batch(statements);return summary;
 }catch(error){const message=error instanceof Error?error.message:'Unknown source failure';await db.batch([
  db.prepare('INSERT INTO source_checks(id,last_attempt,last_error,failures) VALUES(?,?,?,1) ON CONFLICT(id) DO UPDATE SET last_attempt=excluded.last_attempt,last_error=excluded.last_error,failures=source_checks.failures+1').bind(source.id,now,message),
  db.prepare('UPDATE ingestion_runs SET finished_at=?,status=?,summary=? WHERE id=?').bind(new Date().toISOString(),'failed',JSON.stringify({source:source.id,error:message}),runId)
 ]);return {source:source.id,error:message};
 }finally{await db.prepare('DELETE FROM refresh_locks WHERE id=? AND token=?').bind(source.id,token).run();}
}
export {sources};
