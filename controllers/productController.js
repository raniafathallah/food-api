const Product = require('../models/productModel');
const catchAsync = require('../middleware/errorCatchHandler');
const APIFeatures = require('../utils/apiFeatures');

// @desc Create product
// @routes POST /api/products
// @access Private/Admin


// //////////////
const createProduct = catchAsync(async (req, res) => {

  const {
    user,
    name,
    price,
    time,
    portion,
    image,
    brand,
    category,
    numReviews,
    description,
  } = req.body;


  const productExist = await Product.findOne({ name });

  if (productExist) {
    res.status(400);
    throw new Error("product already exists");
  }

  const product = await Product.create({
    name,
    price,
    user,
    brand,
    category,
    time,
    image,
    portion,
    numReviews,
    description,
  });

  if (product) {
    res.status(201).json({
      _id: product._id,
      name: product.name,
      price: product.price,
      user: product.user,
      image: product.image,
      category: product.category,
      time: product.time,
      portion: product.portion,
      countInStock: product.countInStock,
      numReviews: product.numReviews,
      description: product.description,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});



// @desc Fetch all products
// @routes GET /api/products
// @access Public
const getProducts = catchAsync(async (req, res) => {
  const features = new APIFeatures(Product.find({}).populate('user', 'id name'), req.query).filter()
    .sort()
    .limitFields()
    .paginate();
  const docs = await features.query;
  res
    .status(200)
    .json({
      status: 'success',
      results: docs.length,
      data: {
        data: docs
      }
    });

});

// @desc Fetch single products
// @routes GET /api/products/:id
// @access Public
const getProductById = catchAsync(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json(product);
});

// @desc Delete a product
// @routes DELETE /api/products/:id
// @access Private/Admin
const deleteProduct = catchAsync(async (req, res) => {
  const deletedProduct = await Product.findByIdAndRemove(req.params.id);
  if (!deletedProduct) {
    throw new Error('Product not found');
  }
  res
    .status(204)
    .json({
      status: 'success',
      data: null
    });

});


// @desc Update product
// @routes PUT /api/products/:id
// @access Private/Admin
const updateProduct = catchAsync(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body,
    { new: true, runValidators: true });
  if (!updatedProduct) {
    throw new Error('Product not found');
  }

  res
    .status(200)
    .json({
      status: 'success',
      data: {
        user: updatedProduct
      }
    });
});

// @desc Create new review
// @routes POST /api/products/:id/reviews
// @access Private
const createReview = catchAsync(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('you had reviewed before ');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }




});


// @desc GET top rated products
// @routes GET /api/products/top
// @access Public
const getTopProducts = catchAsync(async (req, res) => {
  const products = await Product.find({})
    .sort({ rating: -1 })
    .limit(3);

  res.json(products);
});

module.exports =
{
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createReview,
  getTopProducts,
};
