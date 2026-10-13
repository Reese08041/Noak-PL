import {env} from 'cloudflare:workers';
export function database():D1Database{if(!env.DB)throw Error('Storage is unavailable. Retry shortly.');return env.DB;}
export async function loadRecords(db:D1Database,userId:string){const r=await db.prepare('SELECT kind,key,payload,updated_at FROM user_records WHERE user_id=?').bind(userId).all<any>();return r.results.map(r=>({kind:r.kind,key:r.key,data:JSON.parse(r.payload),updatedAt:r.updated_at}));}
export async function saveRecord(db:D1Database,userId:string,kind:string,key:string,data:unknown,now=new Date().toISOString()){
 await db.prepare('INSERT INTO user_records(user_id,kind,key,payload,updated_at) VALUES(?,?,?,?,?) ON CONFLICT(user_id,kind,key) DO UPDATE SET payload=excluded.payload,updated_at=excluded.updated_at').bind(userId,kind,key,JSON.stringify(data),now).run();
}
