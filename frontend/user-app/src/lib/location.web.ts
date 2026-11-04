export async function getCoordinates():Promise<{latitude:number;longitude:number}>{
 if(!window.isSecureContext)throw Error('Location needs HTTPS or localhost. Choose a city manually.');
 if(!navigator.geolocation)throw Error('This browser does not support location. Choose a city manually.');
 return new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(p=>resolve(p.coords),e=>reject(Error(e.code===1?'Location access is blocked. Allow location in your browser settings, or choose a city below.':e.code===3?'Location lookup timed out. Please choose a city manually.':'Your location is unavailable. Check device location services or choose a city below.')),{enableHighAccuracy:false,timeout:12000,maximumAge:60000}));
}
