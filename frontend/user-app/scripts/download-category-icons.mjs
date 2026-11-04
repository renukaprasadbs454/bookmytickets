import {mkdir,writeFile,readFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const icons=JSON.parse(await readFile(path.join(root,'scripts/flaticon-icons.json'),'utf8'));
const folder=path.join(root,'assets/flaticon');await mkdir(folder,{recursive:true});
for(const icon of icons){
 const file=path.join(folder,icon.slug+'.png');
 try{const cached=await readFile(file);if(cached.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))continue}catch{}
 const response=await fetch(icon.png,{signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error('Flaticon '+icon.slug+': HTTP '+response.status+'. Obtain the free licensed PNG from '+icon.page+' and save it at '+file);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(bytes.length>2000000||!bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])))throw Error('Invalid PNG for '+icon.slug);
 await writeFile(file,bytes);console.log('Prepared licensed category icon: '+icon.slug);
}
