import pg from 'pg';
import {config} from './config.js';
export const pool=new pg.Pool({connectionString:config.DATABASE_URL,max:12});
export type DB=Pick<pg.PoolClient,'query'>;
export async function tx<T>(fn:(db:pg.PoolClient)=>Promise<T>):Promise<T>{const c=await pool.connect();try{await c.query('BEGIN');const result=await fn(c);await c.query('COMMIT');return result;}catch(e){await c.query('ROLLBACK');throw e;}finally{c.release();}}
export async function audit(db:DB,user:string|undefined,action:string,id:string|null=null,meta:unknown={}){await db.query('INSERT INTO audit_events(actor_id,action,resource_id,metadata) VALUES($1,$2,$3,$4)',[user||null,action,id,JSON.stringify(meta)]);}
export class HttpError extends Error{constructor(public status:number,message:string){super(message);}}
export function fail(status:number,message:string):never{throw new HttpError(status,message);}
