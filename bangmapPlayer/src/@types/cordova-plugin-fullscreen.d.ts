export {};

declare global {
    interface Window {
        AndroidFullScreen:{
            isSupported(mode:any,errorFn:(error:any)=>void):void;
            immersiveMode:any;
        }
    }
}