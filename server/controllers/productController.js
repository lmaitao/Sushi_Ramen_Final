import { 
  getAllProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getAverageRating
} from '../models/productModel.js';

export const getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    const products = await getAllProducts(category, search);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    const ratings = await getAverageRating(req.params.id);
    res.json({ ...product, ratings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createProductHandler = async (req, res) => {
  try {
    const { name, description, price, category, image_url, stock } = req.body;
    
    if (!name || !description || !price || !category || !image_url || stock === undefined) {
      return res.status(400).json({ error: 'Please provide all required fields' });
    }

    const product = await createProduct(name, description, price, category, image_url, stock);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateProductHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, stock, is_active } = req.body;
    
    const product = await updateProduct(
      id, 
      name, 
      description, 
      price, 
      category, 
      image_url, 
      stock, 
      is_active
    );
    
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteProductHandler = async (req, res) => {
  try {
    await deleteProduct(req.params.id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};