import {database} from '@/lib/storage';
import {sources,coverageGaps} from '@/lib/catalog';
import {env} from 'cloudflare:workers';
export const dynamic='force-dynamic';
export async function GET(){try{const db=database();const [jobs,checks,runs]=await Promise.all([db.prepare('SELECT payload FROM opportunities ORDER BY first_discovered DESC').all<any>(),db.prepare('SELECT * FROM source_checks').all<any>(),db.prepare('SELECT * FROM ingestion_runs ORDER BY started_at DESC LIMIT 30').all<any>()]);return Response.json({jobs:jobs.results.map(r=>JSON.parse(r.payload)),sources:sources.map(s=>({...s,check:checks.results.find(c=>c.id===s.id)??null})),coverageGaps,runs:runs.results,refreshSchedule:(env as any).REFRESH_SCHEDULE_LABEL??null,asOf:new Date().toISOString()},{headers:{'Cache-Control':'no-store'}});}catch(e){return Response.json({error:'Opportunity storage is unavailable. Please retry.'},{status:503});}}
