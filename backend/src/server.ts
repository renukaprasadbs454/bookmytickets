import {app} from './app.js';
import {config} from './config.js';
import {pool} from './db.js';
await pool.query('SELECT 1');
const server=app.listen(config.PORT,config.HOST,()=>console.log(`BOOK MY TICKETS API http://${config.HOST}:${config.PORT}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>{server.close(()=>{void pool.end().then(()=>process.exit(0));});});
