
const isadmin = async (req,res,next) =>{
    try{
        if(await req.user.isUserAnAdmin()){
            next()
        }
        else{
            res.status(403).send("user is not an admin")
        }
    }
    catch(e){
        res.status(400).send('something went wrong')
    }
    
}

module.exports = isadmin