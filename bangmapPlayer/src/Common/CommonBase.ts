export interface ICommonBase {

}
export interface AsyncConstructor {
    initialized:boolean;
    init():Promise<AsyncConstructor>
}
export class CommonBase implements ICommonBase {
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

    get():any{
        
    }
}
export class Adapter extends CommonBase {
    protected constructor(){
        super();
    };
    Update():any{

    }
}