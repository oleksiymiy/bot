const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    application_name: "Backend",
  },
  pool: { min: 0, max: 30 },
});

sqlRequest = async (sqlText='', params) => {
  try {
    const res = await knex.raw(`${sqlText}`,params)
    if (res) return res.rows
  }
  catch (e) {
    throw e
  }
}

module.exports = {
  sqlRequest,
  knex
  }