export interface CommonBase {

}
export interface AsyncConstructor {
    initialized:boolean;
    init():Promise<AsyncConstructor>
}
export class CommonBase implements CommonBase {
    protected constructor(){
    }
}
export class Manager extends CommonBase {
    protected constructor(){
        super();
    }
}
export class DataManager extends Manager {
    protected constructor(){
        super();
    };

    save(){
        
    }
}