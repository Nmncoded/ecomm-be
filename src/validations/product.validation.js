import Joi from 'joi';
import { authenticateToken } from '../middleware/auth.middleware.js';

export const addProductValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required().min(2).max(20).trim(),
    image_url: Joi.string().required().label("image_url").regex(/^https?:\/\/.+\.(jpg|jpeg|png|gif)$/).message('Please provide a valid url').trim(),
    brand: Joi.string().required().min(2).max(15).trim(),
    category: Joi.string().required().min(2).max(15).trim(),
    description: Joi.string().required().trim(),
    price: Joi.number().required().strict(),
  });

  const { error } = schema.validate(req.body);
  
  if (error) {
    return res.status(400).json({ 
      error: error.details[0].message 
    });
  }
  next();
};