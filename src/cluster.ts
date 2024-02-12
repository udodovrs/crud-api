require("dotenv").config();
const cluster = require('cluster');
const httpCluster = require('http');
const numCPUs = require('os').cpus().length;
const { env } = require('node:process')
const apiHadlerMulti = require('./api-handler')

if (cluster.isPrimary) {    
           
    for (let i = 1; i < numCPUs; i++) {
      const port = env.PORT + i;
      cluster.fork({portWorker: port});      
    } 

    let count = 1

    const server = (client_req:any, client_res:any) =>{
      const chunks: any[] = [];
      client_req.on('data', (chunk:any)=> chunks.push(chunk));
      client_req.on('end', async () => {
         const data = Buffer.concat(chunks);  
         
         const options = {      
          hostname: 'localhost',
          port: env.PORT + count,
          path: client_req.url,
          method: client_req.method,
          headers: client_req.headers                  
       }      

      const proxy = httpCluster.request(options, (res:any) => {
          client_res.writeHead(res.statusCode, res.headers);               
          res.pipe(client_res, {
            end: true
           });
      });
      
      proxy.write(data)

      client_req.pipe(proxy, {
        end: true
      })    
         
     })

     count === (numCPUs - 1 ) ? count = 1 : count++;     
    }

    httpCluster
      .createServer(server)
      .listen(env.PORT, ()=> console.log(`Server Primary pid: ${process.pid} is runing on port ${env.PORT}`))   
          
   
} else{
  httpCluster.createServer(apiHadlerMulti).listen(
        process.env.portWorker, 
        ()=> console.log(`Server Cluster pid: ${process.pid} is runing on port ${process.env.portWorker}`)
      ) 
}