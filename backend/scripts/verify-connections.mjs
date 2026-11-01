const base=process.env.VERIFY_PORTAL_URL||'http://admin-panel:8080';
const assert=(ok,message)=>{if(!ok)throw Error(message)};
const login=await fetch(base+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:process.env.ADMIN_EMAIL,password:process.env.ADMIN_PASSWORD,audience:'admin'})});
assert(login.ok,'Seeded admin login failed: '+login.status);const data=await login.json();assert(data.csrf&&!data.challenge,'Password-only login did not issue a session');const cookie=login.headers.get('set-cookie')?.split(';')[0];assert(cookie,'Session cookie missing');
for(const path of ['/auth/me','/dashboard','/catalog-readiness','/resources/meta']){const r=await fetch(base+'/api'+path,{headers:{cookie}});assert(r.ok,path+' failed: '+r.status);console.log(path,r.status)}
for(const origin of ['https://admin.bmt.kwiko.org','http://localhost:8081']){const r=await fetch('http://api:4100/api/auth/capabilities',{headers:{Origin:origin}});assert(r.headers.get('access-control-allow-origin')===origin,'Allowed CORS origin missing');console.log('Allowed CORS',origin)}
const denied=await fetch('http://api:4100/api/auth/capabilities',{headers:{Origin:'https://untrusted.invalid'}});assert(!denied.headers.get('access-control-allow-origin'),'Unexpected CORS allowance');
const anonymous=await fetch(base+'/api/catalog-readiness');assert(anonymous.status===401,'Readiness must require login');
const logout=await fetch(base+'/api/auth/logout',{method:'POST',headers:{cookie,Origin:'http://127.0.0.1:5178','X-CSRF-Token':data.csrf}});assert(logout.ok,'Logout failed');console.log('Seeded admin login, API proxy, CORS, authenticated dashboard and logout passed.');

if(process.env.SEED_PARTNER_EMAIL&&process.env.SEED_PARTNER_PASSWORD){
 const partner='http://partner-panel:8080';
 const r=await fetch(partner+'/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:process.env.SEED_PARTNER_EMAIL,password:process.env.SEED_PARTNER_PASSWORD,audience:'partner'})});
 assert(r.ok,'Seeded partner login failed: '+r.status);const d=await r.json();assert(d.csrf&&!d.challenge,'Partner password-only session missing');const cookie=r.headers.get('set-cookie')?.split(';')[0];
 const me=await fetch(partner+'/api/auth/me',{headers:{cookie}});assert(me.ok,'Partner session read failed');assert((await me.json()).user.audience==='partner','Wrong partner audience');
 const dashboard=await fetch(partner+'/api/dashboard',{headers:{cookie}});assert(dashboard.ok,'Partner dashboard unavailable');
 const logout=await fetch(partner+'/api/auth/logout',{method:'POST',headers:{cookie,Origin:'http://127.0.0.1:5179','X-CSRF-Token':d.csrf}});assert(logout.ok,'Partner logout failed');console.log('Seeded partner login and dashboard passed.');
}
