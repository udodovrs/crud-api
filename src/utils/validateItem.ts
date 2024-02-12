module.exports = (schema:object, data:object): boolean => {
   let result = true
   const keyOfSchema = Object.keys(schema)
   const keyOfData = Object.keys(data)

   keyOfSchema.forEach((item)=>{
        if(!data.hasOwnProperty(item)){
            result = false
        }
   })

   const isAllroperty = keyOfSchema.length === keyOfData.length
   if( !isAllroperty ){
    result = false
   }

   return result
}