import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findFirst({ 
      where: { email: decoded.email, contact_no: decoded.contact_no },
      select: { id: true, email: true, role_id: true,contact_no: true,name: true }
    });

    if (!user) return res.status(403).json({ error: 'User not found' });

    req.rootUser = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
