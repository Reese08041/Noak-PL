import {getChatGPTUser} from '@/app/chatgpt-auth';
import {database,saveRecord} from '@/lib/storage';
import {lessons,grade} from '@/lib/learning';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)return Response.json({error:'Invalid origin'},{status:403});
 try{const body=await request.json() as any;const lesson=lessons.find(l=>l.id===body.lessonId);if(!lesson)return Response.json({error:'Unknown lesson'},{status:400});
 const correct=body.mode==='review'?body.rating==='remembered':grade(lesson,body.answer);
 if(body.mode==='review'&&!['remembered','again'].includes(body.rating))return Response.json({error:'Choose a review rating'},{status:400});
 const user=await getChatGPTUser();let progress=null;
 if(user){const db=database();const previous=await db.prepare('SELECT payload FROM user_records WHERE user_id=? AND kind=? AND key=?').bind(user.userId,'progress',lesson.id).first<any>();const p=previous?JSON.parse(previous.payload):{};const streak=correct?(p.streak??0)+1:0;const intervalDays=correct?[1,3,7,14,30][Math.min(streak-1,4)]:0;
 progress={attempts:(p.attempts??0)+1,correct:(p.correct??0)+(correct?1:0),lastCorrect:correct,streak,intervalDays,dueAt:new Date(Date.now()+(correct?intervalDays*86400000:10*60000)).toISOString(),lastMode:body.mode??'quiz'};
 await saveRecord(db,user.userId,'progress',lesson.id,progress);
 }
 return Response.json({correct,answer:lesson.answer,explanation:lesson.explanation,resources:lesson.resources,saved:!!user,progress});
 }catch{return Response.json({error:'Could not record this attempt. Your answer has been kept; please retry.'},{status:503});}}
