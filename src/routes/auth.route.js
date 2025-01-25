import express from 'express';
import { login, register } from '../controllers/auth.controller.js';
import { loginValidation, registerValidation } from '../validations/auth.validation.js';
const authRouter = express.Router();

authRouter.post('/register', registerValidation ,register );

authRouter.post('/login', loginValidation ,login );

export default authRouter