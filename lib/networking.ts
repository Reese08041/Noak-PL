export const contactStages=['Researching','Ready to reach out','Reached out','Conversation booked','Stay in touch'] as const;
export type Contact={name:string;company:string;role:string;campus:string;context:string;stage:string;followUp:string;notes:string;subject:string;draft:string};
export const blankContact:Contact={name:'',company:'',role:'',campus:'',context:'',stage:'Researching',followUp:'',notes:'',subject:'',draft:''};
export function composeOutreach(input:{name:string;company:string;role:string;campus:string;context:string;sender:string;experience:string;purpose:string}){
 const {name,company,role,campus,context,sender,experience,purpose}=input;
 const subject=purpose==='Thank you'?`Thank you for your time${company?' — '+company:''}`:purpose==='Follow-up'?`Following up${role?' — '+role:''}`:`A student's question about ${role||'your career path'}${company?' at '+company:''}`;
 const intro=purpose==='Thank you'?'Thank you for taking the time to speak with me.':purpose==='Follow-up'?'I wanted to follow up on my earlier note. I understand your schedule may be busy.':`I'm ${sender.trim()||'[your name]'}, a student${campus.trim()?' at '+campus.trim():''} interested in learning about ${role.trim()||'finance'}.`;
 const detail=context.trim()?context.trim():'[Add one specific, verified reason you chose to contact this person.]';
 const evidence=experience.trim()?`A little about my experience: ${experience.trim()}`:'';
 const ask=purpose==='Thank you'?'[Add one takeaway from your conversation and what you plan to do next.]':`If you have 15 minutes in the coming weeks, I'd value hearing about your path${company.trim()?' at '+company.trim():''} and what you would focus on as an underclassman. No worries if now is not a good time.`;
 return {subject,body:[`Hi ${name.trim()||'[name]'},`,intro,detail,evidence,ask,`Thank you,\n${sender.trim()||'[your name]'}`].filter(Boolean).join('\n\n')};
}
export function validContact(data:any){return data&&Object.keys(blankContact).every(k=>typeof data[k]==='string'&&data[k].length<=(['draft','notes'].includes(k)?12000:1000))&&data.name.trim().length>0&&contactStages.includes(data.stage)&&(!data.followUp||/^\d{4}-\d{2}-\d{2}$/.test(data.followUp));}
