export function isConnected(){
    if(typeof navigator.connection === "undefined" || typeof navigator.connection.type === "undefined") return true;
    return navigator.connection.type !== Connection.NONE;
}