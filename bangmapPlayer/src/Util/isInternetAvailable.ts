export function isConnected(){
    return navigator.connection.type !== Connection.NONE;
}