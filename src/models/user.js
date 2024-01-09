const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const fs = require('fs').promises
const path = require('path')

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                new Error('Invalid Email')
            }
        }
    },
    secondaryEmail:{
        type:String,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                new Error('Invalid Email')
            }
        }
    },
    phone_no:{
        type:String,
        required:true,
        unique:true,
        validate(value){
            if(!validator.isMobilePhone(value)){
                new Error('Invalid Phone Number')
            }
        }
    },
    secondaryphone_no:{
        type:String,
        validate(value){
            if(!validator.isMobilePhone(value)){
                new Error('Invalid Phone Number')
            }
        }
    },
    password:{
        type:String,
        required:true,
        minlength:7,
    },
    profileImgPath:{
        type:String,
        default:''
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]

})

UserSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.SECRET_KEY)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}
UserSchema.methods.isUserAnAdmin = async function(){
    const user = this
    if(user.isAdmin){
        return true
    }
    return false
}

UserSchema.methods.deleteProfilePic = async function(){
    const user = this
    if(user.profileImgPath!='') {
        try {
            const file = path.join(__dirname, '../../',user.profileImgPath)
            await fs.unlink(file);
        } catch (err) {
            console.error(err);
        }
    }
    return false
}

UserSchema.statics.authenticateUsingEmail = async function(email,password){
    let user = await User.findOne({email})
    if(!user){
        user = await User.findOne({secondaryEmail:email})
        if(!user){
            throw new Error("invalid email address")
        }
    }
    const isMatched = await bcrypt.compare(password, user.password)
    if(!isMatched){
        throw new Error('invalid password')
    }
    return user
}

UserSchema.statics.authenticateUsingPhone = async function(phone,password){
    let user = await User.findOne({phone_no:phone})
    if(!user){
        user = await User.findOne({secondaryphone_no:phone})
        if(!user){
            throw new Error('invalid phone number')
        }
    }
    const isMatched = await bcrypt.compare(password, user.password)
    if(!isMatched){
        throw new Error('invalid password')
    }
    return user
}

UserSchema.methods.toJSON =  function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

UserSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})



const User = mongoose.model('User',UserSchema)

module.exports = User