import {writeFile} from 'node:fs/promises';
import {pool,tx} from './db.js';
import {decrypt} from './crypto.js';
import {sendConfirmation} from './providers.js';
import {processRefund} from './commerce.js';
import {pushTick} from './push.js';
export async function tick(){await pool.query("DELETE FROM email_otps WHERE expires_at<now()-interval '1 day'");
 await pool.query("UPDATE holds SET status='expired' WHERE status='active' AND expires_at<=now()");
 await pool.query("DELETE FROM auth_challenges WHERE expires_at<now()-interval '1 day'");
 await pool.query("DELETE FROM sessions WHERE expires_at<now()");
 await pool.query("UPDATE notification_jobs SET status='pending',locked_at=NULL WHERE status='processing' AND locked_at<now()-interval '5 minutes'");
 await pool.query("UPDATE refunds SET status='review' WHERE status='processing' AND processing_at<now()-interval '5 minutes'");
 const jobs=await tx(async db=>(await db.query("UPDATE notification_jobs SET status='processing',locked_at=now(),attempts=attempts+1 WHERE id IN (SELECT id FROM notification_jobs WHERE status='pending' AND available_at<=now() ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 10) RETURNING *")).rows);
 for(const job of jobs){try{const result=await sendConfirmation(job.channel,{...job.payload,token:decrypt(job.payload.tokenCipher)});await pool.query('UPDATE notification_jobs SET status=$1,result=$2,locked_at=NULL WHERE id=$3',[result.status,result.result,job.id]);}catch{await pool.query("UPDATE notification_jobs SET status=$1,result='Provider request failed',locked_at=NULL,available_at=now()+interval '2 minutes' WHERE id=$2",[job.attempts>=3?'failed':'pending',job.id]);}}
 const refunds=await tx(async db=>(await db.query("UPDATE refunds SET status='processing',processing_at=now() WHERE id IN (SELECT id FROM refunds WHERE status='approved' ORDER BY created_at FOR UPDATE SKIP LOCKED LIMIT 3) RETURNING id")).rows);
 for(const row of refunds)await processRefund(row.id);
 await pushTick(undefined,async()=>{if(process.env.WORKER_HEARTBEAT_PATH)await writeFile(process.env.WORKER_HEARTBEAT_PATH,String(Date.now()));});
}
if(process.argv[1]?.endsWith('worker.ts')){const stop={value:false};process.on('SIGTERM',()=>{stop.value=true;});process.on('SIGINT',()=>{stop.value=true;});while(!stop.value){try{await tick();if(process.env.WORKER_HEARTBEAT_PATH)await writeFile(process.env.WORKER_HEARTBEAT_PATH,String(Date.now()));}catch(e){console.error('Worker cycle failed:',e instanceof Error?e.message:'Unknown error');}await new Promise(resolve=>setTimeout(resolve,3000));}await pool.end();}
