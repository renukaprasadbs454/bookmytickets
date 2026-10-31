import 'dotenv/config';
import {z} from 'zod';
const env=z.object({DATABASE_URL:z.string().min(1),APP_KEY:z.string().regex(/^[a-fA-F0-9]{64}$/),PORT:z.coerce.number().default(4100),HOST:z.string().default('127.0.0.1'),PUBLIC_ORIGIN:z.string().url().default('http://127.0.0.1:4100'),WEB_ORIGINS:z.string().default('http://127.0.0.1:5178,http://127.0.0.1:5179'),STORAGE_ROOT:z.string().default('../storage'),NODE_ENV:z.string().default('development')}).passthrough().parse(process.env);
export const config=env;
export const optional=(name:string)=>String(process.env[name]||'');
