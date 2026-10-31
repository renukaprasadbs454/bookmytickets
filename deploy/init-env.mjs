import {randomBytes} from 'node:crypto';
import {existsSync,writeFileSync,mkdirSync} from 'node:fs';
if(existsSync('/config/.env')||existsSync('/config/backend/.env'))throw Error('Environment files already exist; refusing to overwrite');
const secret=()=>randomBytes(32).toString('hex'),password=secret();mkdirSync('/config/backend',{recursive:true});
writeFileSync('/config/.env',`POSTGRES_USER=bmt\nPOSTGRES_DB=bmt\nPOSTGRES_PASSWORD=${password}\nEXPO_PUBLIC_API_URL=https://user.bmt.kwiko.org\n`,{mode:0o600});
writeFileSync('/config/backend/.env',`DATABASE_URL=postgresql://bmt:${password}@postgres:5432/bmt\nAPP_KEY=${secret()}\nADMIN_EMAIL=admin@bmt.kwiko.org\nADMIN_NAME=Platform Admin\nADMIN_PASSWORD=${secret()}\nSTAFF_MFA_ENABLED=false\nSEED_PARTNER_EMAIL=\nSEED_PARTNER_PASSWORD=\nPUBLIC_ORIGIN=https://user.bmt.kwiko.org\nTICKET_PUBLIC_ORIGIN=https://user.bmt.kwiko.org\nWEB_ORIGINS=https://admin.bmt.kwiko.org,https://partner.bmt.kwiko.org,https://user.bmt.kwiko.org\nSTORAGE_ROOT=/app/storage\n`,{mode:0o600});console.log('Private environment files generated. Read backend/.env for the admin credentials.');
