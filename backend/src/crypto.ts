import {createCipheriv,createDecipheriv,createHash,randomBytes,timingSafeEqual} from 'node:crypto';
import {config} from './config.js';
export const token=()=>randomBytes(32).toString('base64url');
export const hash=(v:string|Buffer)=>createHash('sha256').update(v).digest('hex');
export function encrypt(value:string){const iv=randomBytes(12),cipher=createCipheriv('aes-256-gcm',Buffer.from(config.APP_KEY,'hex'),iv);const b=Buffer.concat([cipher.update(value,'utf8'),cipher.final()]);return [iv,cipher.getAuthTag(),b].map(x=>x.toString('base64url')).join('.');}
export function decrypt(value:string){const [iv,tag,b]=value.split('.').map(x=>Buffer.from(x,'base64url'));const c=createDecipheriv('aes-256-gcm',Buffer.from(config.APP_KEY,'hex'),iv);c.setAuthTag(tag);return Buffer.concat([c.update(b),c.final()]).toString('utf8');}
export function same(a:string,b:string){const aa=Buffer.from(a),bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb);}
