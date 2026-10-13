import Workspace from './workspace';
export default async function Home({searchParams}:{searchParams:Promise<{view?:string|string[]}>}){
 const params=await searchParams;
 return <Workspace initialView={typeof params.view==='string'?params.view:'home'}/>;
}
