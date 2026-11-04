import {createHash,randomUUID} from 'node:crypto';
import {mkdir,writeFile,access} from 'node:fs/promises';
import path from 'node:path';
import argon2 from 'argon2';
import sharp from 'sharp';
import {pool,tx,audit} from '../src/db.js';
import {definitions} from '../src/definitions.js';
import {config} from '../src/config.js';

// Explicit local-only fixture import. Never part of the production bootstrap.
const id=(key:string)=>{const h=createHash('sha256').update('bmt-local-catalog-v1:'+key).digest('hex');return `${h.slice(0,8)}-${h.slice(8,12)}-4${h.slice(13,16)}-a${h.slice(17,20)}-${h.slice(20,32)}`};
const photos={
 interstellar:'https://image.tmdb.org/t/p/w780/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
 dune:'https://image.tmdb.org/t/p/w780/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
 inception:'https://image.tmdb.org/t/p/w780/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
 darkknight:'https://image.tmdb.org/t/p/w780/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
 concert:'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1200&q=85',
 comedy:'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=1000&q=85',
 theatre:'https://images.unsplash.com/photo-1503095396549-807759245b35?w=1000&q=85',
 sports:'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1000&q=85',
 workshop:'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1000&q=85',
 exhibition:'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?w=1000&q=85',
 activity:'https://images.unsplash.com/photo-1551632811-561732d1e306?w=1000&q=85',
 venue:'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=85',
 cinema:'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&q=85',
};
async function main(){
 if(process.env.ALLOW_DEMO_SEED!=='true'||process.env.NODE_ENV==='production')throw Error('Demo catalog requires ALLOW_DEMO_SEED=true and a non-production environment.');
 const password=process.env.DEMO_PARTNER_PASSWORD;if(!password||password.length<12)throw Error('Set DEMO_PARTNER_PASSWORD (12+ characters).');
 const founder=(await pool.query("SELECT id FROM users WHERE platform_role='founder' AND disabled=false LIMIT 1")).rows[0];if(!founder)throw Error('Run the normal founder bootstrap first.');
 const assets:Record<string,{id:string;key:string;bytes:Buffer}>={};
 for(const [key,url] of Object.entries(photos)){
  const mediaId=id('media:'+key),storageKey='public/'+mediaId+'.webp',file=path.join(config.STORAGE_ROOT,storageKey);
  if((await pool.query('SELECT id FROM media_assets WHERE id=$1',[mediaId])).rowCount){try{await access(file);continue}catch{}}
  const response=await fetch(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`Artwork ${key}: HTTP ${response.status}`);
  const bytes=await sharp(Buffer.from(await response.arrayBuffer())).resize({width:1200,height:1600,fit:'inside',withoutEnlargement:true}).webp({quality:86}).toBuffer();
  await mkdir(path.dirname(file),{recursive:true});await writeFile(file,bytes);assets[key]={id:mediaId,key:storageKey,bytes};
 }
 await tx(async db=>{
  await db.query("SELECT pg_advisory_xact_lock(hashtext('bmt-local-demo-seed'))");
  for(const [key,a] of Object.entries(assets))await db.query("INSERT INTO media_assets(id,created_by,storage_key,original_name,mime,bytes,checksum,visibility,purpose) VALUES($1,$2,$3,$4,'image/webp',$5,$6,'public','poster') ON CONFLICT(id) DO NOTHING",[a.id,founder.id,a.key,key+'.webp',a.bytes.length,createHash('sha256').update(a.bytes).digest('hex')]);
  async function resource(key:string,kind:string,name:string,data:any,org?:string,owner=founder.id){const resourceId=id(key);const parsed=definitions[kind].schema.parse(data);await db.query("INSERT INTO resources(id,kind,name,organization_id,owner_id,status,data) VALUES($1,$2,$3,$4,$5,'approved',$6) ON CONFLICT(id) DO NOTHING",[resourceId,kind,name,org||null,owner,JSON.stringify(parsed)]);return resourceId;}
  const partners=[['aurora','Aurora Cinemas','Aarav Mehta','aurora.partner@example.test',['theatre_owner','venue_owner']],['spotlight','Spotlight Live','Meera Rao','spotlight.partner@example.test',['organizer','venue_owner']],['canvas','Canvas Experiences','Kabir Shah','canvas.partner@example.test',['organizer','venue_owner']]] as const;
  const orgs:string[]=[];
  for(const [key,name,owner,email,types] of partners){await db.query('INSERT INTO users(id,email,name,password_hash) VALUES($1,$2,$3,$4) ON CONFLICT(email) DO NOTHING',[id('owner:'+key),email,owner,await argon2.hash(password)]);const user=(await db.query('SELECT id FROM users WHERE email=$1',[email])).rows[0];const org=await resource('org:'+key,'organization',name,{types:[...types],email,phone:'+91900000000'+(orgs.length+1),businessIdentifier:'DEMO-'+key.toUpperCase(),documentIds:[],description:'Local demonstration business. Verification documents and bank details have not been collected.'},id('org:'+key),user.id);await db.query("INSERT INTO memberships(user_id,organization_id,role) VALUES($1,$2,'owner') ON CONFLICT(user_id,organization_id) DO NOTHING",[user.id,org]);orgs.push(org);}
  for(const key of Object.keys(photos)){const p=['interstellar','dune','inception','darkknight','cinema'].includes(key)?0:['concert','comedy','theatre'].includes(key)?1:2;await db.query('UPDATE media_assets SET organization_id=$1 WHERE id=$2 AND organization_id IS NULL',[orgs[p],id('media:'+key)]);}
  const cities=[['Bengaluru','Karnataka',12.9716,77.5946],['Mumbai','Maharashtra',19.076,72.8777],['Delhi','Delhi',28.6139,77.209],['Hyderabad','Telangana',17.385,78.4867],['Chennai','Tamil Nadu',13.0827,80.2707],['Pune','Maharashtra',18.5204,73.8567],['Ahmedabad','Gujarat',23.0225,72.5714],['Kolkata','West Bengal',22.5726,88.3639]] as const;
  for(const [name,state,latitude,longitude] of cities)await resource('city:'+name,'location',name,{state,country:'IN',latitude,longitude});
  const categories=[['Movies','movie'],['Concerts & Music','music'],['Comedy','comedy'],['Theatre & Plays','play'],['Sports','sports'],['Workshops','workshop'],['Exhibitions','exhibition'],['Activities','activity'],['Venue Rentals','venue-rentals']];
  for(const [name,slug] of categories)await resource('category:'+slug,'category',name,{slug,description:'Discover '+name.toLowerCase()+' across your city.'});
  const experiences=[
   ['interstellar','Interstellar','movie',169,'English','Sci-fi','A journey beyond the stars, where a team of explorers searches for a future for humanity. Rediscover the scale and emotion of this modern classic.','U/A 13+'],
   ['dune','Dune: Part Two','movie',166,'English','Adventure','Return to Arrakis for an epic story of destiny, power and sacrifice. An immersive big-screen showcase.','U/A 13+'],
   ['inception','Inception','movie',148,'English','Thriller','Enter a world where dreams can be shared and ideas can change everything. A mind-bending cinematic experience.','U/A 13+'],
   ['darkknight','The Dark Knight','movie',152,'English','Action','Gotham faces its greatest test in this gripping story of courage, chaos and the price of being a hero.','U/A 13+'],
   ['concert','Afterglow: Live Sessions','music',150,'Hindi','Live music','An open-air evening of independent music, warm lights and unforgettable choruses. General admission and fan-zone tickets available.','16+'],
   ['comedy','The Weekend Laugh Club','comedy',90,'English','Stand-up','A fresh lineup of local comics brings sharp observations and big laughs to an intimate stage. Seating opens 30 minutes before the show.','18+'],
   ['theatre','Letters After Midnight','play',110,'English','Drama','An intimate original play about chance encounters and the stories we leave unwritten. A live performance in two acts.','12+'],
   ['sports','City Runners: Sunday 5K','sports',120,'English','Running','Make your Sunday count. A community run with warm-up, hydration points and a celebratory finish. Bring your own running shoes.','12+'],
   ['workshop','Write Your First Story','workshop',180,'English','Creative writing','Find your voice through guided writing exercises, peer feedback and a hands-on storytelling session. Suitable for beginners.','16+'],
   ['exhibition','Frames of the City','exhibition',120,'English','Photography','A curated photography exhibition celebrating everyday life, architecture and the hidden corners of our cities.','All ages'],
   ['activity','Sunrise Trail Collective','activity',240,'English','Outdoors','A guided morning trail with scenic stops and a relaxed community breakfast. Moderate fitness recommended.','16+'],
  ] as const;
  const cast=[['Matthew McConaughey','Actor'],['Anne Hathaway','Actor'],['Timothée Chalamet','Actor'],['Zendaya','Actor'],['Leonardo DiCaprio','Actor'],['Christian Bale','Actor'],['Heath Ledger','Actor'],['Christopher Nolan','Director']] as const;
  for(const [name,credits] of cast)await resource('person:'+name,'person',name,{credits,biography:'Explore film credits and related experiences.'},orgs[0]);
  const credits:Record<string,string[]>={interstellar:['Matthew McConaughey','Anne Hathaway','Christopher Nolan'],dune:['Timothée Chalamet','Zendaya'],inception:['Leonardo DiCaprio','Christopher Nolan'],darkknight:['Christian Bale','Heath Ledger','Christopher Nolan']};
  const contentIds:string[]=[];
  for(const [key,name,type,duration,language,genre,description,certification] of experiences)contentIds.push(await resource('content:'+key,'content',name,{type,categoryId:id('category:'+type),description:description+' Local demo listing; showtimes are for testing.',languages:[language],genres:[genre],formats:[type==='movie'?'2D':'Live'],durationMinutes:duration,certification,castIds:(credits[key]||[]).map(name=>id('person:'+name)),mediaIds:[id('media:'+(key==='theatre'?'theatre':key))]},orgs[type==='movie'?0:['music','comedy','play'].includes(String(type))?1:2]));
  for(const [key,names] of Object.entries(credits))await db.query("UPDATE resources SET data=jsonb_set(data,'{castIds}',$2::jsonb),version=version+1 WHERE id=$1 AND data->'castIds'='[]'::jsonb",[id('content:'+key),JSON.stringify(names.map(name=>id('person:'+name)))]);
  let showCount=0;
  for(let cityIndex=0;cityIndex<cities.length;cityIndex++){
   const [city,,lat,lng]=cities[cityIndex];
   for(let p=0;p<3;p++){
    const venueKey=`venue:${city}:${p}`,venueName=[`Aurora Cinemas · ${city}`,`Spotlight Arena · ${city}`,`Canvas House · ${city}`][p];
    const venue=await resource(venueKey,'venue',venueName,{locationId:id('city:'+city),address:`${p+12}, Cultural District, ${city}. Demo location.`,latitude:lat+p*.012,longitude:lng+p*.012,facilities:['Parking','Accessible entrance',...(p===0?['Dolby surround','Air conditioning','Food & beverages']:['Refreshments','Restrooms'])],mediaIds:[id('media:'+(p===0?'cinema':p===1?'concert':'venue'))],description:['A contemporary cinema with comfortable seating and immersive sound.','A flexible live entertainment destination for music, comedy and theatre.','A welcoming space for workshops, exhibitions and memorable gatherings.'][p]},orgs[p]);
    const seats=Array.from({length:6},(_,r)=>Array.from({length:10},(_,s)=>({key:String.fromCharCode(65+r)+(s+1),label:String.fromCharCode(65+r)+(s+1),row:String.fromCharCode(65+r),category:r<2?'Recliner':'Premium',accessible:r===5&&s===0,blocked:false}))).flat();
    const space=await resource('space:'+venueKey,'space',p===0?'Screen 01 · Dolby 7.1':'Main Hall',{venueId:venue,layoutVersion:1,seats:p===0?seats:[],description:p===0?'60 seats · Premium and recliner sections':'Flexible general admission venue'},orgs[p]);
    const indices=p===0?[0,1,2,3]:p===1?[4,5,6]:[7,8,9,10];
    for(const [slot,index] of indices.entries()){
     const key=`show:${city}:${index}`,showId=id(key);if((await db.query('SELECT 1 FROM resources WHERE id=$1',[showId])).rowCount)continue;
     const start=new Date();start.setDate(start.getDate()+2+slot);start.setUTCHours(p===0?12:10,30,0,0);const end=new Date(start.getTime()+(Number(experiences[index][3])+30)*60000),price=p===0?25000:p===1?69900:49900;
     await resource(key,'show',experiences[index][1]+' · '+city,{contentId:contentIds[index],venueId:venue,spaceId:space,startsAt:start.toISOString(),endsAt:end.toISOString(),inventoryType:p===0?'reserved':'general',basePriceMinor:price,sectionPrices:p===0?[{category:'Recliner',priceMinor:45000}]:[],tiers:p===0?[]:[{key:'general',label:'General admission',capacity:120,priceMinor:price},{key:'premium',label:'Premium access',capacity:40,priceMinor:price+30000}],language:experiences[index][4],format:p===0?'2D':'Live',bookingCutoffMinutes:15},orgs[p]);
     await db.query("INSERT INTO venue_reservations(show_id,space_id,during) VALUES($1,$2,tstzrange($3,$4,'[)'))",[showId,space,start,end]);
     const inventory=p===0?seats.map(s=>({key:s.key,label:s.label,capacity:1,price:s.category==='Recliner'?45000:price,metadata:s})):[{key:'general',label:'General admission',capacity:120,price,metadata:{}},{key:'premium',label:'Premium access',capacity:40,price:price+30000,metadata:{}}];
     for(const i of inventory)await db.query('INSERT INTO inventory(show_id,key,label,capacity,price_minor,metadata) VALUES($1,$2,$3,$4,$5,$6)',[showId,i.key,i.label,i.capacity,i.price,JSON.stringify(i.metadata)]);
     showCount++;
    }
    if(p===0)await resource('addon:'+venueKey,'addon','Classic popcorn combo',{venueId:venue,priceMinor:25000,description:'Medium salted popcorn and one soft drink.'},orgs[p]);
   }
  }
  const until=new Date(Date.now()+90*86400000).toISOString(),since=new Date(Date.now()-86400000).toISOString();
  for(const [i,key,title] of [[0,'dune','The big screen is calling'],[1,'concert','Make room for live music'],[2,'interstellar','Rediscover something extraordinary']] as const)await resource('promotion:'+key,'promotion',title,{placement:i===2?'featured':'home',mediaId:id('media:'+key),targetId:id('content:'+key),startsAt:since,endsAt:until,priority:100-i*10},orgs[i===1?1:0]);
  await resource('policy:demo','policy','Local demo booking policy',{commissionBps:1000,feeMinor:3000,holdMinutes:5,maxTickets:8,cancelBeforeMinutes:120,refundFee:false,payoutDelayHours:48});
  await resource('coupon:welcome','coupon','A little welcome from us',{code:'WELCOME10',discountBps:1000,maxDiscountMinor:15000,minOrderMinor:30000,maxUses:1000,expiresAt:until});
  await audit(db,founder.id,'demo.catalog_seed',null,{cities:cities.length,partners:3,newShows:showCount});
  console.log(`Local demo catalog ready: 3 partners, ${cities.length} cities, 9 categories, 24 venues, 11 experiences; ${showCount} new shows. Existing records and passwords retained.`);
 });
}
try{await main()}finally{await pool.end()}
