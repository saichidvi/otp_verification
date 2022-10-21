const { ACCESS_DENIED_ERR } = require("../app/src/errors");

module.exports = (req,res,next) => {
    const currentUser = req.locals.user;

    if(!currentUser){
        return next({status : 401, message : ACCESS_DENIED_ERR});
    }
    if(currentUser.role === "admin"){
        return next();
    }
    return next({status : 401,message : ACCESS_DENIED_ERR});
};