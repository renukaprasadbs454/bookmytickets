import {createHmac} from 'node:crypto';
import {optional,config} from './config.js';
import {tx,fail} from './db.js';
import {hash,token,same} from './crypto.js';
export const TEST_OTP='123456';
export function customerOtpTestMode(contact?:string){
 if(optional('CUSTOMER_OTP_TEST_MODE')!=='true')return false;
 const allowed=optional('CUSTOMER_OTP_TEST_CONTACTS').split(',').map(x=>x.trim().toLowerCase()).filter(Boolean);
 return !contact||!allowed.length||allowed.includes(contact.toLowerCase());
}
const digest=(seed:string,code:string)=>createHmac('sha256',config.APP_KEY).update(seed+':'+code).digest('hex');
export async function requestTestSms(phone:string){
 const raw=token(),key=hash(raw);
 await tx(async db=>{await db.query('SELECT pg_advisory_xact_lock(hashtextextended($1,0))',['test-sms:'+phone]);if((await db.query("SELECT 1 FROM auth_challenges WHERE kind='sms_otp_test' AND context->>'phone'=$1 AND expires_at>now()+interval '4 minutes'",[phone])).rowCount)fail(429,'Wait one minute before requesting another code');await db.query("DELETE FROM auth_challenges WHERE kind='sms_otp_test' AND context->>'phone'=$1",[phone]);await db.query("INSERT INTO auth_challenges(token_hash,kind,context,expires_at) VALUES($1,'sms_otp_test',$2,now()+interval '5 minutes')",[key,JSON.stringify({phone,codeHash:digest(key,TEST_OTP)})]);});
 return {message:'Customer OTP testing is enabled. Use 123456. No SMS was sent.',testMode:true,expiresIn:300};
}
export async function verifyTestSms(phone:string,code:string){
 if(!customerOtpTestMode(phone))return false;
 return tx(async db=>{const row=(await db.query("SELECT * FROM auth_challenges WHERE kind='sms_otp_test' AND context->>'phone'=$1 AND expires_at>now() ORDER BY expires_at DESC LIMIT 1 FOR UPDATE",[phone])).rows[0];if(!row||row.attempts>=5)return false;if(!same(row.context.codeHash,digest(row.token_hash,code))){await db.query('UPDATE auth_challenges SET attempts=attempts+1 WHERE token_hash=$1',[row.token_hash]);return false;}await db.query('DELETE FROM auth_challenges WHERE token_hash=$1',[row.token_hash]);return true;});
}
