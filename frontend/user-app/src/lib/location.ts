import * as Location from 'expo-location';
export async function getCoordinates(){
 const permission=await Location.requestForegroundPermissionsAsync();if(permission.status!=='granted')throw Error('Location access is blocked. Enable it in device settings or choose a city below.');
 let timer:ReturnType<typeof setTimeout>|undefined;try{return await Promise.race([Location.getCurrentPositionAsync({accuracy:Location.Accuracy.Balanced}).then(p=>p.coords),new Promise<never>((_,reject)=>{timer=setTimeout(()=>reject(Error('Location lookup timed out. Please choose a city manually.')),15000)})])}finally{if(timer)clearTimeout(timer)}
}
