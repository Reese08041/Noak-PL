import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';
import {spawnSync} from 'node:child_process';
const base='.sites-runtime/test';
for(const file of ['lib/catalog.ts','lib/normalize.ts','lib/ingest.ts','lib/filter.ts','lib/learning.ts','lib/networking.ts','lib/sprint.ts','tests/core.test.ts']){
 const dest=path.join(base,file.replace(/\.ts$/,'.js'));await fs.mkdir(path.dirname(dest),{recursive:true});
 const source=await fs.readFile(file,'utf8');const result=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext}}).outputText.replace(/from (["'])(\.\.?\/[^"']+)\1/g,(_,q,p)=>'from '+q+p+'.js'+q);
 await fs.writeFile(dest,result);
}
const r=spawnSync(process.execPath,['--test',base+'/tests/core.test.js'],{stdio:'inherit'});process.exit(r.status??1);
