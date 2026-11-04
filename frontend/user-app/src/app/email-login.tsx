import React,{useEffect,useState} from 'react';
import {Pressable,Text,TextInput} from 'react-native';
import {useLocalSearchParams,useRouter} from 'expo-router';
import AuthLayout from '../components/AuthLayout';
import {api,useSession} from '../lib/session';
import {Button,ErrorBox,Muted,common,usePalette} from '../lib/ui';
export default function EmailLogin(){
 const params=useLocalSearchParams<{returnTo?:string}>(),router=useRouter(),c=usePalette(),{signIn}=useSession();const [email,setEmail]=useState(''),[code,setCode]=useState(''),[challenge,setChallenge]=useState(''),[busy,setBusy]=useState(false),[testing,setTesting]=useState(false),[error,setError]=useState(''),[retry,setRetry]=useState(0);
 useEffect(()=>{if(!challenge)return;const timer=setInterval(()=>setRetry(v=>Math.max(0,v-1)),1000);return()=>clearInterval(timer)},[challenge]);
 const valid=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
 async function request(){setBusy(true);setError('');try{const x=await api('/auth/email-otp/request','POST',{email:email.trim()});setChallenge(x.challenge);setTesting(!!x.testMode);setCode(x.testMode?'123456':'');setRetry(60)}catch(e:any){setError(e.message)}finally{setBusy(false)}}
 async function verify(){setBusy(true);setError('');try{const x=await api('/auth/email-otp/verify','POST',{challenge,code});await signIn(x.token);router.replace(/^\/(show|shows)\/[0-9a-f-]{36}$/i.test(params.returnTo||'')?params.returnTo as any:'/' )}catch(e:any){setError(e.message)}finally{setBusy(false)}}
 const link=(title:string,action:()=>void,disabled=false)=><Pressable accessibilityRole="button" disabled={disabled} onPress={action} style={{alignItems:'center',padding:7,opacity:disabled?.5:1}}><Text style={{color:c.accent,fontSize:13,fontWeight:'700'}}>{title}</Text></Pressable>;
 return <AuthLayout title={challenge?(testing?'Enter your code.':'Check your inbox.'):'Let’s make a plan.'} subtitle={challenge?'Enter the six-digit verification code for '+email.trim():'Sign in with your email. Your favourite experiences are waiting.'} step={challenge?'VERIFY YOUR EMAIL':'YOUR NEXT GREAT EXPERIENCE STARTS HERE'}><ErrorBox error={error}/>
 <Text style={{color:c.text,fontSize:13,fontWeight:'700'}}>{challenge?'Verification code':'Email address'}</Text>
 {challenge?<TextInput accessibilityLabel="Email verification code" placeholder="000000" placeholderTextColor={c.muted} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" maxLength={6} value={code} onChangeText={v=>setCode(v.replace(/\D/g,''))} style={[common.input,{color:c.text,borderColor:c.border,backgroundColor:c.bg,textAlign:'center',fontSize:29,fontWeight:'800',letterSpacing:9,paddingVertical:18}]} onSubmitEditing={()=>{if(code.length===6&&!busy)void verify()}}/>:<TextInput accessibilityLabel="Email address" placeholder="you@example.com" placeholderTextColor={c.muted} keyboardType="email-address" textContentType="emailAddress" autoComplete="email" autoCapitalize="none" autoCorrect={false} value={email} onChangeText={v=>{setEmail(v);setError('')}} style={[common.input,{color:c.text,borderColor:c.border,backgroundColor:c.bg,padding:16}]} onSubmitEditing={()=>{if(valid&&!busy)void request()}}/>}
 <Button title={busy?'Please wait…':challenge?'Verify & sign in':'Email me a code'} disabled={busy||(challenge?code.length!==6:!valid)} onPress={()=>{if(challenge)void verify();else void request()}}/>
 {testing&&<Muted>Testing mode · Use 123456. No email was sent.</Muted>}
 {challenge?<>{link(retry?'Resend code in '+retry+'s':'Resend code',()=>{void request()},busy||retry>0)}{link('Use another email',()=>{setChallenge('');setCode('');setError('')},busy)}<Muted>Your code expires in five minutes.</Muted></>:<Muted>No password to remember. Just a verification code to get you on your way.</Muted>}
 {link('Back to mobile sign-in',()=>router.replace({pathname:'/login',params:{returnTo:params.returnTo||''}}),busy)}
 </AuthLayout>;
}
