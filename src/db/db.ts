const { mkdir, writeFile, readdir, readFile, unlink } = require('node:fs/promises');
const { join } = require('node:path');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

class DB {
    private _nameColection: string;

    constructor(nameColection: string) {
        this._nameColection = nameColection
        this.instanceMethod()
    }

    async instanceMethod() {
        const projectFolder = join(__dirname, this._nameColection);        
        await mkdir(projectFolder, { recursive: true });
    }

    public async create(data: object) {        
        const id = uuidv4()
        const user = {id, ...data}
        const userStringifyed = JSON.stringify(user, null, 2)
        const pathNewFile = join(__dirname, this._nameColection, id + '.json')   
        try {
            await writeFile(pathNewFile, userStringifyed, {
                flag: "wx",
            });
            return userStringifyed
        } catch (e:any){
            console.error(e.message);
            return "Failed to create a record"
        }
    }

    public async getAllcolection (): Promise<string> {
        const pathDir = join(__dirname, this._nameColection);
        const result:object[] = []        
        try {
            const files = await readdir(pathDir);
            for ( const item of files){
                const pathFile = join(pathDir, item)
                const content = await readFile(pathFile)
                const obj = JSON.parse(content)
                result.push(obj) 
            }
            return JSON.stringify(result, null, 2)            
          } catch (e:any){
            console.error(e.message);
            return e.message
        }         
    }

    public async getElemnt (id:string): Promise<string>{
        const pathFile = join(__dirname, this._nameColection, id + '.json');
        if(!uuidValidate(id)){
            return 'Unsuitable id format'
        }
        try{
            const content = await readFile(pathFile)
            return content.toString()

        } catch (e:any){
            console.error(e.message);
            return "No results"
        }
    }

    public async updateElement (id:string, data: object): Promise<string> {
        const pathFile = join(__dirname, this._nameColection, id + '.json');
        if(!uuidValidate(id)){
            return 'Unsuitable id format'
        }
        try{
            const content = await readFile(pathFile)
            const obj = JSON.parse(content)
            const updateObj = {...obj, ...data}
            const stringifyedObj = JSON.stringify(updateObj, null, 2) 
            await writeFile(pathFile, stringifyedObj, {
                flag: "w+",
            });

            return stringifyedObj
        } catch (e:any){
            console.error(e.message);
            return "No results"
        }
    }

    public async deleteElement (id: string): Promise<string>{
        const pathFile = join(__dirname, this._nameColection, id + '.json');
        if(!uuidValidate(id)){
            return 'Unsuitable id format'
        }
        try{
            await unlink(pathFile)
            return 'The item has been deleted' 
        } catch (e:any){
            console.error(e.message);
            return "No results"
        }
    }
}

module.exports = DB




