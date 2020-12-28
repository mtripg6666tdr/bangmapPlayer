export interface CommonBase {

}
export interface AsyncConstructor {
    initialized:boolean;
    init():Promise<AsyncConstructor>
}
export class CommonBase implements CommonBase {

}
export class Manager extends CommonBase {

}