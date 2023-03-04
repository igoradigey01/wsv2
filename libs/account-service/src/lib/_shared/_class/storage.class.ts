export abstract class Storage{


    abstract clear():void;
    abstract get Set():string|null;
    abstract set Get(access_token:string|null);
    abstract remove():void;
}