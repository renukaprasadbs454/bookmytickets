import {Platform} from 'react-native';
import React,{createContext,useContext,useEffect,useState,useCallback} from 'react';
import * as SecureStore from './secure-storage';
import * as Crypto from 'expo-crypto';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const BASE=process.env.EXPO_PUBLIC_API_URL||(Platform.OS==='web'?'':'http://10.0.2.2:4100');
let credential:string|null=null;
export async function api(path:string,method='GET',body?:unknown){const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);try{const r=await fetch(BASE.replace(/\/$/,'')+'/api'+path,{method,signal:controller.signal,headers:{'Content-Type':'application/json',...(credential?{Authorization:'Bearer '+credential}:{})},...(body?{body:JSON.stringify(body)}:{})});const raw=await r.text();let d:any;try{d=raw?JSON.parse(raw):{}}catch{throw new Error('The service returned an unexpected response. Please try again.')}if(!r.ok)throw Object.assign(new Error(d.error||'Request failed'),{status:r.status});return d}catch(e:any){if(e.name==='AbortError')throw new Error('The service took too long to respond. Please try again.');throw e}finally{clearTimeout(timer)}}

const Session=createContext({user:null as any,ready:false,mode:'dark' as 'dark'|'light',city:null as any,setCity:(_c:any)=>{},setMode:(_m:'dark'|'light')=>{},signIn:async(_t:string)=>{},signOut:async()=>{},refresh:async()=>{}});
export function SessionProvider({children}:{children:React.ReactNode}){const [user,setUser]=useState<any>(null),[ready,setReady]=useState(false),[mode,setModeState]=useState<'light'|'dark'>('dark'),[city,setCityState]=useState<any>(null);const refresh=useCallback(async()=>{if(credential){try{setUser((await api('/auth/me')).user)}catch(e:any){if(e.status===401||e.status===403){setUser(null);credential=null;await SecureStore.deleteItemAsync('bmt-session');}}}},[]);
useEffect(()=>{void (async()=>{try{await AsyncStorage.multiRemove(['cinepass-v1','cinepass-theme']);credential=await SecureStore.getItemAsync('bmt-session');const m=await SecureStore.getItemAsync('bmt-theme');if(m==='light'||m==='dark')setModeState(m);const savedCity=await AsyncStorage.getItem('bmt-city');if(savedCity){try{const selected=await api('/public/resources/'+savedCity);if(selected.kind==='location')setCityState(selected)}catch{await AsyncStorage.removeItem('bmt-city')}}await refresh()}finally{setReady(true)}})()},[refresh]);
const signIn=useCallback(async(t:string)=>{if(!t||typeof t!=='string')throw new Error('The service did not return a valid sign-in session. Please try again.');credential=t;try{await SecureStore.setItemAsync('bmt-session',t);setUser((await api('/auth/me')).user)}catch(e){credential=null;setUser(null);await SecureStore.deleteItemAsync('bmt-session').catch(()=>{});throw e}},[]);
const signOut=useCallback(async()=>{try{const {unregisterPush}=await import('./push');await unregisterPush().catch(()=>{});await api('/auth/logout','POST')}finally{credential=null;setUser(null);await SecureStore.deleteItemAsync('bmt-session')}},[]);
function setCity(value:any){setCityState(value);void (value?AsyncStorage.setItem('bmt-city',value.id):AsyncStorage.removeItem('bmt-city')).catch(()=>{})}
function setMode(m:'dark'|'light'){setModeState(m);void SecureStore.setItemAsync('bmt-theme',m)}
return <Session.Provider value={{user,ready,mode,setMode,city,setCity,signIn,signOut,refresh}}>{children}</Session.Provider>}
export const useSession=()=>useContext(Session);
export const money=(n:unknown)=>'₹'+(Number(n||0)/100).toFixed(2);
export const image=(id?:string)=>id?BASE+'/api/media/'+id:undefined;
export const newKey=()=>Crypto.randomUUID();
let handoff:{code:string;promise:Promise<any>}|null=null;
export function finishGoogle(code:string){if(handoff?.code===code)return handoff.promise;const promise=(async()=>{const verifier=await SecureStore.getItemAsync('bmt-pkce');if(!verifier)throw new Error('Google login expired. Start again.');try{return await api('/auth/google/exchange','POST',{code,verifier})}finally{await SecureStore.deleteItemAsync('bmt-pkce')}})();handoff={code,promise};return promise;}

