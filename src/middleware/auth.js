const jwt=require("jsonwebtoken")

const auth=async function(req,res,next){
    try{
        let token = req.headers["X-Api-Key"];
        if (!token) {
          token = req.headers["x-api-key"];
        }
        
        if(!token) return res.status(403).send({status:false,msg:"Token is required"})
        
        let decodedToken =jwt.verify(token, 'assignment')//error 500
        
        if(!decodedToken){
            return res.status(403).send({status:false,message:"Invalid authentication"})
        }
        
        req.userId=decodedToken.userId
            
            next()
    }
    
catch(err){
    return res.status(500).send({msg:err.message})
}
}

module.exports.auth=auth