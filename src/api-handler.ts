const validateItem = require('./utils/validateItem')
const DataBase = require('./db/db');
const getContentTypeAndCod = require('./utils/get-content-type-and-cod')
const exampleUser = require('./db/user-schema')

const User = new DataBase('users')

module.exports = async (req:any, res:any) => {
    try{
        if(req.url === '/api/users' && req.method === "GET"){
            res.writeHead(200, {'Content-Type': 'application/json'})
            const users = await User.getAllcolection()
            res.end(users)
    
        } else if (/^\/api\/users\/..../.test(req.url) && req.method === "GET"){
            const parseUrl = req.url.split('/')
            const id = parseUrl[parseUrl.length-1]
            const user = await User.getElemnt(id)
            const {code , contentType} = getContentTypeAndCod(user, 200)
            res.writeHead(code, {'Content-Type': contentType})
            res.end(user) 
    
        } else if (req.url === '/api/users' && req.method === "POST"){
            const chunks: any[] = [];
            req.on('data', (chunk:any)=> chunks.push(chunk));
            req.on('end', async () => {
                const data = Buffer.concat(chunks).toString();
                try{
                    const dataForNewUser = JSON.parse(data)
                    if(validateItem(exampleUser, dataForNewUser)){
                        const newUser = await User.create(dataForNewUser)
                        res.writeHead(201, {'Content-Type': 'application/json'})
                        res.end(newUser)
                    } else {
                        res.writeHead(400, {'Content-Type': 'text/plain'})
                        res.end('Invalid request')
                    }
                } catch {
                    res.writeHead(400, {'Content-Type': 'text/plain'})
                    res.end('Invalid request')
                }         
            })     
    
        } else if (/^\/api\/users\/..../.test(req.url) && req.method === "DELETE"){
            const parseUrl = req.url.split('/')
            const id = parseUrl[parseUrl.length-1]
            const resDB = await User.deleteElement(id)
            const {code , contentType} = getContentTypeAndCod(resDB, 204)        
            res.writeHead(code, {'Content-Type': contentType})
            res.end(resDB)  
    
        } else if (/^\/api\/users\/..../.test(req.url) && req.method === "PUT") {
            const parseUrl = req.url.split('/')
            const id = parseUrl[parseUrl.length-1]
            const chunks: any[] = [];
            req.on('data', (chunk:any)=> chunks.push(chunk));
            req.on('end', async () => {
                const data = Buffer.concat(chunks).toString();
                try{
                    const dataForUpdateUser = JSON.parse(data)
                    if(validateItem(exampleUser, dataForUpdateUser)){
                        const updatedUser = await User.updateElement(id, dataForUpdateUser)
                        const {code , contentType} = getContentTypeAndCod(updatedUser, 200)
                        res.writeHead(code, {'Content-Type': contentType})
                        res.end(updatedUser)             
                    } else {
                        res.writeHead(400, {'Content-Type': 'text/plain'})
                        res.end('Invalid request')
                    }
                } catch {
                    res.writeHead(400, {'Content-Type': 'text/plain'})
                    res.end('Invalid request')
                }         
            })
            
    
        } else {
            res.writeHead(404, {'Content-Type': 'text/plain'})
            res.end(`It's not valid endpoint ${req.url}`)               
        }

    }
    catch{
        res.writeHead(500, {'Content-Type': 'text/plain'})
        res.end('Error on the server')  
    }    
}