require("dotenv").config();
const singleThreadServer = require('./createserver')

singleThreadServer(process.env.PORT)






