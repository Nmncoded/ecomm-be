import express from 'express';
import { login, register, refreshToken } from '../controllers/auth.controller.js';
import { loginValidation, registerValidation } from '../validations/auth.validation.js';
import { authenticateToken } from '../middleware/auth.middleware.js';
const authRouter = express.Router();

authRouter.post('/register', registerValidation ,register );

authRouter.post('/login', loginValidation ,login );
authRouter.get('/refreshToken' , refreshToken );

export default authRouter