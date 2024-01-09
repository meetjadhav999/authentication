const express = require('express')
const isadmin = require('../middlewares/isAdmin.js')

const router = express.Router()


router.get('',(req,res)=>{
    res.render('index')
})

router.get('/register',(req,res)=>{
    res.render('signup',data={url:'/api/register'})
})

router.get('/login-email',(req,res)=>{
    res.render('loginusingemail')
})
router.get('/login-phoneno',(req,res)=>{
    res.render('loginusingphone')
})

router.get('/register-admin',(req,res)=>{
    res.render('registerAdmin')
})

router.get('/upload-picture',(req,res)=>{
    res.render('uploadimg')
})

router.get('/change-password',(req,res)=>{
    res.render('changepass')
})

router.get('/admin',(req,res)=>{
    res.render('adminHomePage')
})
router.get('/user/:id',(req,res)=>{
    res.render('userpage')
})

module.exports = router