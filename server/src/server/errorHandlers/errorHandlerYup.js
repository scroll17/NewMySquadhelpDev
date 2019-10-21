const { BadRequest } = require("../errors/errors");

module.exports = (err,req,res,next) =>{
    if(err.name === "ValidationError"){
        console.log(err);

        const error = new BadRequest();
        res.status(error.status).send(err.message);

    }else{
        next(err);
    }
};
