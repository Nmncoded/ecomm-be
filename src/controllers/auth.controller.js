import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/Db.config.js';

export const register = async (req, res) => {
  try {
    const { email, password,name, contact_no,role_id } = req.body;

    
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ contact_no }, { email }],
      },
    });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const isValidRole = await prisma.role.findFirst({ where: { id: role_id } });

    if(!isValidRole) {
      return res.status(400).json({ error: 'Select correct role.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { 
        email, 
        password: hashedPassword,
        contact_no,
        name,
        role_id
      }
    });

    res.status(201).json({success: true, message: 'Registration successful.'});
  } catch (error) {
    res.status(500).json({ error: 'Registration failed',err:error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role_id } = req.body;
    
    const user = await prisma.user.findFirst({ where: { email },select: { id: true, email: true, role_id: true,contact_no: true,name: true, password: true } });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if(user.role_id !== role_id) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id, contact_no: user.contact_no },
      process.env.JWT_SECRET,
      { expiresIn: '10s' }
    );


    const refresh_token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id, contact_no: user.contact_no },
      process.env.JWT_REFRESH_SECRET
    );

    delete user.password;

    res.json({ success: true, message: 'Login successful',token, userDTO: user, refresh_token });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // console.log('refreshToken inside backend');
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
  
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    // console.log('refreshToken inside backend ------ ',decoded);

    const user = await prisma.user.findFirst({ 
      where: { email: decoded.email, contact_no: decoded.contact_no },
      select: { id: true, email: true, role_id: true,contact_no: true,name: true }
    });

    if (!user) return res.status(403).json({ error: 'User not found' });

    const access_token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id, contact_no: user.contact_no },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );


    res.json({ success: true,access_token });
  } catch (error) {
    res.status(500).json({ error: 'refreshToken failed' });
  }
};

export const authController = {
  login,
  register,
  refreshToken
}