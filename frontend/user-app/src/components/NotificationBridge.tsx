import {useEffect,useRef} from 'react';
import {AppState} from 'react-native';
import {useRouter} from 'expo-router';
import * as Notifications from 'expo-notifications';
import {api,useSession} from '../lib/session';
import {syncPush} from '../lib/push';
export default function NotificationBridge(){const {user,city}=useSession(),router=useRouter(),handled=useRef(new Set<string>());
 useEffect(()=>{if(!user)return;const sync=()=>{void syncPush(city?.id).catch(()=>{})};sync();const app=AppState.addEventListener('change',state=>{if(state==='active')sync()});const token=Notifications.addPushTokenListener(()=>sync());return()=>{app.remove();token.remove()}},[user,city]);
 useEffect(()=>{const open=(response:Notifications.NotificationResponse)=>{const key=response.notification.request.identifier;if(handled.current.has(key))return;handled.current.add(key);const d=response.notification.request.content.data;const uuid=(v:unknown)=>typeof v==='string'&&/^[0-9a-f-]{36}$/i.test(v);if(user&&uuid(d.notificationId))void api('/push/inbox/'+d.notificationId+'/read','POST').catch(()=>{});if(['content','venue'].includes(String(d.destination))&&uuid(d.id))router.push('/listing/'+String(d.id) as any);else if(d.destination==='bookings')router.push('/(tabs)/bookings');else router.push('/(tabs)');};const subscription=Notifications.addNotificationResponseReceivedListener(open);const last=Notifications.getLastNotificationResponse();if(last)open(last);return()=>subscription.remove()},[router,user]);return null;
}
