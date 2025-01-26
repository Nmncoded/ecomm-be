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
    const { name, price, brand, description, category, image_url } = req.body;

    const data = await prisma.product.create({
      data: {
        name,
        price,
        brand,
        description,
        category,
        image_url,
        user_id: req?.rootUser?.id
      }
    });

    res.json({ success: true, message: 'Product successfully added.' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'addProduct failed',err });
  }
};

export const authController = {
  addProduct,
  getAllProducts,
}