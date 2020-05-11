const User = require('../models/user')

const deserializeUSer = (req,res,next)=>{
    const userId = req.session.userId
    User.findById(userId)
    .then(user =>{
        req.user = user
        next()
    })
    .catch(error =>next(error))
}

module.exports = deserializeUSer