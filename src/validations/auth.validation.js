import Joi from 'joi';

export const registerValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(50).trim(),
    email: Joi.string().trim(true).email().required(),
    contact_no: Joi.string().required().label("contact_no").min(10).max(12).regex(/^[0-9]{10,12}$/).message('Please provide a valid contact number'),
    password: Joi.string().required().min(3).max(30).trim(),
    role_id: Joi.number().required().label("role_id").valid(1,2),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error: error.details[0].message 
    });
  }

  next();
};

export const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().trim(true).email().required(),
    password: Joi.string().required().min(3).max(30).trim(),
    role_id: Joi.number().required().label("role_id").valid(1,2),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error: error.details[0].message 
    });
  }

  next();
};
