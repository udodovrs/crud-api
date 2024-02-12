const http = require('node:http')
const apiHadlerSingle = require('./api-handler')

module.exports = (PORT:number) => {
    http.createServer(
        apiHadlerSingle
        )
        .listen(
            PORT, ()=> console.log(`Server is runing on port ${PORT}`)
        )
}
