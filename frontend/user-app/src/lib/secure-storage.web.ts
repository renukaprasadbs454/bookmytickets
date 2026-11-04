// Browser sessions are scoped to this tab; native builds retain encrypted SecureStore.
export async function getItemAsync(key:string){return sessionStorage.getItem(key)}
export async function setItemAsync(key:string,value:string){sessionStorage.setItem(key,value)}
export async function deleteItemAsync(key:string){sessionStorage.removeItem(key)}
