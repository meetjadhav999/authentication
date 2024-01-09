const User = require('../models/user.js')
const path = require('path')
const multer = require('multer')
const fs = require('fs').promises

exports.registerAdmin = async (req,res) => {
    let data = {
        name: req.body.name,
        email: req.body.email,
        phone_no: req.body.phone_no,
        password: req.body.password,
        isAdmin:true
        
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
        res.status(201).send({ user, token })
    } catch (e) {
        if(req.body.name === ''){
            return res.status(400).json({
                error:"Name cannot be empty"
            })
        }
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

exports.getAllUser = async (req,res)=>{
    
    const user = await User.find({})
    return res.send(user)
    
}

exports.getUser = async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        res.send(user)
    }catch(e){
        res.status(404).send('user not found')
    }
    
}

exports.editUserName = async (req,res) => {
    try{
        const user = await User.findById(req.params.id)
        user.name = req.body.name 
        await user.save()
        res.send("name updated")
    }
    catch(e){
        res.status(404).send("user not found")
    }
}

exports.editProfilePic = async (req,res)=>{
    try{
        const user = await User.findById(req.params.id)
        const picPath = user.profileImgPath
        if(picPath!=''){
            await user.deleteProfilePic()
        }
        let imagePath = ''
        if (req.file) {
            imagePath = '/uploads/' + req.file.filename; // Adjust the path as needed
        }
        user.profileImgPath = imagePath
        await user.save()
        res.send("profile pic updated successfully")
    }catch(e){
        res.status(404).send('user not found')
    }
    
}

exports.deleteUser = async (req,res) => {
    if(await req.user.isUserAnAdmin()){
        try{
            const user = await User.findById(req.params.id)
            await user.deleteProfilePic()
            await user.deleteOne()
            res.send(user)
        }catch(e){
            res.status(404).send("user not found")
        }
    }
    else{
        res.status(400).send("user not an admin")
    }
}