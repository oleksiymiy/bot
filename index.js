require("dotenv").config();
const app = require('./app')
const PORT = process.env.PORT || 5000
const { sqlRequest } = require("./db_config/postgres");
const winston = require("./logger");

const start = async () => {

    try {
        await sqlRequest('SELECT 1+1')
        app.listen(PORT, () => {
            console.log(`server started on port ${PORT}`)
        })
    } catch (e) {
        winston.error(`message -> '${e.message}' type_message -> '${e.type_message}' code -> '${e.code_error}' stack -> ' ${e.stack} '`)
    }

}

start()

