const Joi = require ('@hapi/joi'); 

//Sign In Validation 
const signupValidation = (data) => {
    var schema = Joi.object({ 
        firstname: Joi.string().required(),
        lastname:Joi.string().required(),
        email:Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        password: Joi.string().required(),
    }); 
    return schema.validate(data); 
}; 

const loginValidation = (data) => {
    var schema = Joi.object({
        email:Joi.string().required(),
        password: Joi.string().required()
    });
    return schema.validate(data); 
}

module.exports = {
    signupValidation, loginValidation

}; 