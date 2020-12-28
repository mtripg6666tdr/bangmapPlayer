export class FileUtil {
    directoryEntry:DirectoryEntry;
    fileName:string;
    private fileEntry:FileEntry

    constructor(entry:DirectoryEntry, filename:string){
        this.directoryEntry = entry;
        this.fileName = filename;
        this.fileEntry = null;
    };

    writeText(data:string){
        return new Promise<void>((resolve,reject) => {
            this.directoryEntry.getFile(this.fileName, {create:true}, function(fileEntry){
                fileEntry.createWriter(function(filewriter){
                    filewriter.onwriteend = function(){
                        resolve();
                    };
                    filewriter.onerror = function(error){
                        reject(error);
                    }
                    filewriter.write(new Blob([data], {type:"text/plain"}))
                })
            }, function(error){
                reject(error);
            })
        });
    }

    readText(){
        return new Promise<string>(async (resolve,reject) => {
            if(await this.exists()){
                this.fileEntry.file(function(file){
                    file.text().then(function(data){
                        resolve(data);
                    }, function(error){
                        reject(error);
                    })
                })
            }else{
                reject("Target file was not found");
            }
        });
    }

    exists(){
        return new Promise<boolean>((resolve,reject) => {
            this.directoryEntry.getFile(this.fileName, {create:false}, function(entry){
                this.fileEntry = entry;
                resolve(true);
            }, function(){
                reject(false);
            })
        });
    }
}

export function resolveLocalFileSystemURL_s(url:string){
    return new Promise<DirectoryEntry>((resolve, reject) => {
        window.resolveLocalFileSystemURL(url, function(e_0_){
            resolve(e_0_ as DirectoryEntry);
        }, function(error){
            reject(error);
        })
    });
}