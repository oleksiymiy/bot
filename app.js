const express = require('express')
const authRouter = require('./router')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const winston = require('./logger/index')
const ApiError = require('./Error/index')
const { createClient } = require("redis")
const session = require('express-session')
const RedisStore = require("connect-redis")(session)
const redisClient = createClient({ legacyMode: true })
const app = express()

app.use(helmet())
app.use(express.json())
app.use(session({
    secret: process.env.COOCKIE_SECRET,
    name:process.env.SESSION_NAME,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({client: redisClient}),
    cookie : {
        httpOnly: true,
        maxAge : 1000*60*60
    }
}))
app.use(cookieParser())
app.use(cors())
app.use('/auth', authRouter)
app.use(async (req,res,next)=>{
    next(new Error('Not Found'))
    })
app.use((err, req, res, next) => {
    winston.error(`message -> '${err.message}'  code -> '${err.code}' stack -> ' ${err.stack} '`)
    if (err instanceof ApiError) {
        return res.status(err.status).json({ message: err.message, errors: err.errors })
    }
    return res.status(500).json({ message: err.message })
})

redisClient.connect().then (()=>console.log('connected')).catch(e=>console.log(e))

module.exports = app;