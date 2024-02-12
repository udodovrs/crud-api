module.exports = (responsseDB:string, codeMethod:number) => {
    if(responsseDB === 'Unsuitable id format'){
        return{
            code: 400,
            contentType: 'text/plain'
        }
        
    } else if (responsseDB === "No results"){
        return{
            code: 404,
            contentType: 'text/plain'
        }
    } else {
        return{
            code: codeMethod,
            contentType: codeMethod === 200? 'application/json':'text/plain'
        }
    }
}