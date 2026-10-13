import {env} from 'cloudflare:workers';
import {database} from '@/lib/storage';
import {refreshSource,sources} from '@/lib/ingest';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 // Private Sites dispatch is the authentication boundary for unattended writers.
 // Keep disabled unless the Site is confirmed owner-private. Disable BEFORE any audience change.
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Cross-origin writes are not permitted'},{status:403});
 if((env as any).PRIVATE_REFRESH_ENABLED!=='true')return Response.json({error:'Private scheduled writer is not enabled'},{status:403});
 const source=sources.find(s=>s.id===new URL(request.url).searchParams.get('source'));
 if(!source)return Response.json({error:'Choose a registered source'},{status:400});
 try{const result=await refreshSource(database(),source);return Response.json(result,{status:'error' in result?502:200});}catch{return Response.json({error:'Storage unavailable'},{status:503});}
}
