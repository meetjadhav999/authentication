const express = require("express")
const mongoose = require("mongoose")
const session = require('express-session')
const hbs = require('hbs')
const path = require('path')

const userRoute = require("./routes/user")
const adminRoute = require('./routes/admin.js')
const pagesRoute = require('./routes/pages.js')


const app = express()

mongoose.connect(process.env.MONGO_DB_PATH)

app.use(express.static(path.join(__dirname,'../public/statics')))
app.set('view engine','hbs')
app.set('views',path.join(__dirname,'../public/templates'))
hbs.registerPartials(path.join(__dirname,'../public/templates/partials'))
app.use(express.json())

app.use(session({
    secret: 'thisismyverysecretkey',
    resave: false,
    saveUninitialized: true,
  }));
  

app.use('/api',userRoute)
app.use('/api/admin',adminRoute)
app.use(pagesRoute)


app.listen(process.env.PORT,()=>{
    console.log('server running on port '+ process.env.PORT)
})