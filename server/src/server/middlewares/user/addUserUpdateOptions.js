const  {
    USER_FIELDS: {
        AVATAR
    },
    USER_FIELDS_TO_UPDATE
} = require("../../constants");


const { BadRequest } = require("../../errors/errors");

const isUndefined = require("lodash/isUndefined");

module.exports = (typeUpdate) => (req, res, next) => {
    const {
        accessTokenPayload,
    } = req;

    if(req.fileValidationError){
        return next(req.fileValidationError)
    }

    if(isUndefined(accessTokenPayload)){
        return next(new BadRequest())
    }



    const options = {
        where: {
            id: accessTokenPayload.id
        }
    };


    if(typeUpdate === AVATAR){
        options.fields = [AVATAR];

        req.body.updateFields = req.body;

    }else{
        options.fields = USER_FIELDS_TO_UPDATE

    }

    req.body.updateOptions = options;
    next()

};