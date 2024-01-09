const User = require('../models/user.js')
const path = require('path')
const multer = require('multer')
const fs = require('fs').promises

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
            return cb(new Error('file must be an image'))
        }
        cb(undefined, true)
    }
});


exports.upload = multer({ storage: storage });

exports.register = async (req, res) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        password: req.body.password,
        
    }
    if(req.body.secondaryEmail){
        const finduser = await User.findOne({secondaryEmail:req.body.secondaryEmail})
        if(!finduser && req.body.secondaryEmail !== undefined){
            data = {
                ...data,
                secondaryEmail:req.body.secondaryEmail
            }
        }
        else{
            return res.status(400).json({
                error:"Secondary email already exist"
            })
        }
    }
    if(req.body.secondaryphone_no){
        const finduser = await User.findOne({secondaryphone_no:req.body.secondaryphone_no})
        if(!finduser && req.body.secondaryphone_no !== undefined){
            data = {
                ...data,
                secondaryphone_no:req.body.secondaryphone_no
            }
        }
        else{
            return res.status(400).json({
                error:"Secondary Phone no already exist"
            })
        }
        
    }
    const user = new User(data);

    try {
        await user.save()
        const token = await user.generateAuthToken()
        req.session.token = {token}
        res.status(201).send({ user, token })
    } catch (e) {
        if(req.body.password.length<8){
            return res.status(400).json({
                error:"Password should be more than 8 characters"
            })
        }
        if(await User.findOne({email:req.body.email})){
            return res.status(400).json({
                error:"email already exist"
            })
        }
        if(await User.findOne({phone_no:req.body.phone_no})){
            return res.status(400).json({
                error:"phone number already exist"
            })
        }
        else{
            return res.status(400).json({
                error:"something went wrong"
            })
        }

    }
}

exports.updateProfilepic = async (req, res) => {
    if (req.user.profileImgPath != '') {
        req.user.deleteProfilePic()
    }
    let imagePath = ''
    if (req.file) {
        imagePath = '/uploads/' + req.file.filename; // Adjust the path as needed
    }
    req.user.profileImgPath = imagePath
    req.user.save()
    res.send('profile picture saved')
}

exports.login = async (req,res) =>{
    if(req.body.email){
        try{
            const user = await User.authenticateUsingEmail(req.body.email,req.body.password)
            const token = await user.generateAuthToken()
            res.send({user,token})
        }
        catch(e){
            res.status(400).send({
                error:"Invalid Email and Password"
            })
        }
        
    }
    else if(req.body.phone_no){
        try{
            const user = await User.authenticateUsingPhone(req.body.phone_no,req.body.password)
            const token = await user.generateAuthToken()
            req.session.token = {token}
            res.send({user,token})
        }
        catch(e){
            res.status(400).send({
                error:"Invalid Phone number and Password"
            })
        }
    }
    else res.status(400).json({
        error:"Email or Phone number is not provided"
    })
}

exports.updateUserName = async (req,res) =>{
    try{
        req.user.name = req.body.name
        const user = await req.user.save()
        res.send(user)
    }
    catch(e){
        res.status(400).send('name is required')
    }
    
}

exports.updatePassword = async (req,res) =>{
    try{
        req.user.password = req.body.password
        const user = await req.user.save()
        res.send(user) 
    }catch(e){
        res.status(400).send('password is required')
    }
    
}

exports.deleteUser = async (req,res) =>{
    if (req.user.profileImgPath != '') {
        req.user.deleteProfilePic()
    }
    await req.user.deleteOne()
    res.send('user deleted')
}

exports.userProfile = async (req,res) => {
    const user = req.user
    res.send(user)
}

exports.logout = async (req,res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send("logged out")
    }catch(e){
        res.status(500).send()
    }
    
}

exports.getProfileImg = async (req, res) => {
    const img = await User.findOne({ _id: req.params.id })
    let imagePath
    if(img.profileImgPath ==''){
        imagePath = path.join(__dirname, '../../uploads/profileimg.png' )
        return res.sendFile(imagePath)

    }
    imagePath = path.join(__dirname, '../../', img.profileImgPath)
    return res.sendFile(imagePath)

}
