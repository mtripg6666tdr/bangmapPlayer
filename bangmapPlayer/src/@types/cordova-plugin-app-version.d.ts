export {};

declare global {
    interface Cordova {
        getAppVersion:{
            getVersionNumber(success:(v:any)=>void, fail:(v:any)=>void):any;
        }
    }
}