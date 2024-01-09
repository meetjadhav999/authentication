const express = require('express')
const path = require('path')
const auth = require('../middlewares/auth.js')
const {register,getProfileImg,upload, updateProfilepic, login, updateUserName, updatePassword,deleteUser, userProfile, logout} = require('../controllers/user.js')

const router = express.Router()

  
router.post('/register',register)
router.post('/user-profile',auth,upload.single('profileimg'),updateProfilepic)
router.post('/login',login)
router.patch('/update-name',auth, updateUserName)
router.patch('/update-password',auth,updatePassword)
router.get('/profileImg/:id',getProfileImg)
router.delete('/user',auth,deleteUser)
router.get('/user',auth,userProfile)
router.delete('/logout',auth,logout)
module.exports = router