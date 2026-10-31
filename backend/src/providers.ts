import {optional,config} from './config.js';
import {fail} from './db.js';
export async function providerFetch(url:string,init:RequestInit={}){const res=await fetch(url,{...init,signal:AbortSignal.timeout(15000)});let body:any;try{body=await res.json();}catch{body={};}if(!res.ok)fail(502,'External provider rejected the request');return body;}
function twilioAuth(){const sid=optional('TWILIO_ACCOUNT_SID'),secret=optional('TWILIO_AUTH_TOKEN');if(!sid||!secret)fail(503,'SMS provider is not configured');return 'Basic '+Buffer.from(sid+':'+secret).toString('base64');}
export async function twilioVerify(action:'start'|'check',phone:string,code?:string){const service=optional('TWILIO_VERIFY_SERVICE_SID');if(!service)fail(503,'SMS OTP is not configured');const values:Record<string,string>=action==='start'?{To:phone,Channel:'sms'}:{To:phone,Code:code!};const response=await providerFetch(`https://verify.twilio.com/v2/Services/${encodeURIComponent(service)}/${action==='start'?'Verifications':'VerificationCheck'}`,{method:'POST',headers:{Authorization:twilioAuth(),'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams(values)});return action==='start'||response.status==='approved';}
export function paymentReady(){return optional('RAZORPAY_KEY_ID').startsWith('rzp_test_')&&!!optional('RAZORPAY_KEY_SECRET');}
export async function razorpay(path:string,method='GET',body?:unknown){if(!paymentReady())fail(503,'Razorpay sandbox is not configured');return providerFetch('https://api.razorpay.com/v1/'+path,{method,headers:{Authorization:'Basic '+Buffer.from(optional('RAZORPAY_KEY_ID')+':'+optional('RAZORPAY_KEY_SECRET')).toString('base64'),'Content-Type':'application/json'},...(body?{body:JSON.stringify(body)}:{})});}
export async function sendConfirmation(channel:string,payload:any):Promise<{status:'sent'|'skipped';result:string}>{
 const from=optional(channel==='sms'?'TWILIO_SMS_FROM':'TWILIO_WHATSAPP_FROM'),sid=optional('TWILIO_ACCOUNT_SID');
 if(!from||!sid||!optional('TWILIO_AUTH_TOKEN'))return {status:'skipped',result:'Channel is not configured'};
 if(!payload.phone)return {status:'skipped',result:'Customer has no verified phone'};
 if(!publicTicketOrigin())return {status:'skipped',result:'A public HTTPS ticket origin is required'};
 const url=optional('TICKET_PUBLIC_ORIGIN')+'/ticket/'+payload.token;
 const form=new URLSearchParams({From:from,To:channel==='whatsapp'?'whatsapp:'+payload.phone:payload.phone});
 if(channel==='whatsapp'){if(!optional('TWILIO_WHATSAPP_CONTENT_SID'))return {status:'skipped',result:'Approved WhatsApp confirmation template is not configured'};form.set('ContentSid',optional('TWILIO_WHATSAPP_CONTENT_SID'));form.set('ContentVariables',JSON.stringify({'1':payload.title,'2':url}));}
 else form.set('Body',`BOOK MY TICKETS: Your booking for ${payload.title} is confirmed. Ticket: ${url}`);
 const response=await providerFetch(`https://api.twilio.com/2010-04-01/Accounts/${encodeURIComponent(sid)}/Messages.json`,{method:'POST',headers:{Authorization:twilioAuth(),'Content-Type':'application/x-www-form-urlencoded'},body:form});return {status:'sent',result:'Accepted by provider: '+response.sid};
}

function publicTicketOrigin(){try{const u=new URL(optional('TICKET_PUBLIC_ORIGIN'));return u.protocol==='https:'&&!u.username&&!u.password&&!/^(localhost$|127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.|0\.|169\.254\.|\[)/i.test(u.hostname)}catch{return false}}
