if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
} 

const DB = require('./config/DB')
const express = require('express')
const cookieParser = require('cookie-parser')

DB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(cookieParser())


app.listen(process.env.PORT);