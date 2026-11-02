import {Platform} from 'react-native';
import * as Notifications from 'expo-notifications';
import * as SecureStore from 'expo-secure-store';
import * as Crypto from 'expo-crypto';
import {api} from './session';
const key='bmt-push-device';
Notifications.setNotificationHandler({handleNotification:async()=>({shouldShowBanner:true,shouldShowList:true,shouldPlaySound:false,shouldSetBadge:false})});
export async function registerPush(cityId?:string,requestPermission=false){
 if(Platform.OS!=='android')throw Error('Phone push is currently available on Android. Your inbox works on all supported platforms.');
 const preferences=await api('/push/preferences');if(!preferences.pushConfigured)throw Error('Android push is awaiting Firebase setup. You can still receive announcements in your inbox.');
 await Notifications.setNotificationChannelAsync('announcements',{name:'BOOK MY TICKETS announcements',importance:Notifications.AndroidImportance.DEFAULT});
 let permission=await Notifications.getPermissionsAsync();if(!permission.granted&&requestPermission)permission=await Notifications.requestPermissionsAsync();
 if(!permission.granted)throw Error('Notifications are disabled for this app. Enable them in Android settings to receive phone alerts.');
 const token=await Notifications.getDevicePushTokenAsync();if(token.type!=='android'||typeof token.data!=='string')throw Error('Android push registration is unavailable.');
 let id=await SecureStore.getItemAsync(key);if(!id)id=Crypto.randomUUID();
 const response=await api('/push/devices','POST',{id,token:token.data,platform:'android',...(cityId?{cityId}:{})});await SecureStore.setItemAsync(key,response.id);return response;
}
export async function unregisterPush(){const id=await SecureStore.getItemAsync(key);if(id)await api('/push/devices/'+id,'DELETE');}
export async function syncPush(cityId?:string){const id=await SecureStore.getItemAsync(key);if(!id)return;const preferences=await api('/push/preferences');if(preferences.marketingPush&&preferences.pushConfigured)await registerPush(cityId);else await unregisterPush();}
