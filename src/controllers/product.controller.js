import prisma from '../config/Db.config.js';

export const getAllProducts = async (req, res) => {
  try {

    
    const data = await prisma.product.findMany({
      where: {
        user_id: req?.rootUser?.id
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json({success: true, message: 'Fetched successfully.',data});
  } catch (error) {
    res.status(500).json({ error: 'getAllProducts failed',err:error });
  }
};

export const addProduct = async (req, res) => {
  try {
    console.log('inside addProduct api')
    const { name, price, brand, description, category, image_url } = req.body;

    console.log(req.body,req?.rootUser);

    res.json({ success: true, message: 'Product successfully added.' });
  } catch (error) {
    res.status(500).json({ error: 'addProduct failed' });
  }
};

export const authController = {
  addProduct,
  getAllProducts,
}