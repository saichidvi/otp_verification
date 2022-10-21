const User = require("../models/user.model");

const { AUTH_TOKEN_MISSING_ERR, AUTH_HEADER_MISSING_ERR, JWT_DECODE_ERR, USER_NOT_FOUND_ERR } = require("../app/src/errors");
const { verifyJwtToken } = require("../app/src/utils/token.util");



module.exports = async (req,res,next) => {
    try {
        //check for auth header from the client 
        const header  = req.header.authorization
        if(!header){
            next({status : 403,message : AUTH_HEADER_MISSING_ERR})
            return
        }

        //verify auth token 
        const token = header.split("Bearer")[1]
        if(!token){
            next({status : 403,message : AUTH_TOKEN_MISSING_ERR})
            return
        }

        const userId = verifyJwtToken(token,next)

        if(!userId){
            next({status : 403,message : JWT_DECODE_ERR})
            return 
        }

        const user = await User.findById(userId)

        if(!user){
            next({status : 403,message : USER_NOT_FOUND_ERR})
            return
        }

        res.locals.user  = user
        
        next()
    }catch(err){
        next(err)
    }
}