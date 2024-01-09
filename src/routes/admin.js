const express = require('express')
const auth = require('../middlewares/auth.js')
const isadmin = require('../middlewares/isAdmin.js')
const {registerAdmin, getAllUser, deleteUser, editProfilePic, editUserName, getUser} = require('../controllers/admin.js')
const {upload} = require('../controllers/user.js')

const router = express.Router()

router.post('/registerAdmin',registerAdmin)
router.get('/All-users',auth,isadmin,getAllUser)
router.get('/user/:id',auth,isadmin,getUser)
router.patch('/user/:id',auth,isadmin,editUserName)
router.patch('/user-profilepic/:id',auth,isadmin,upload.single('profileimg'),editProfilePic)
router.delete('/user/:id',auth,isadmin,deleteUser)
module.exports = router