const express = require('express');
const {
  createProduct,
  getProducts,
  getProductById,
  deleteProduct,
  updateProduct,
  createReview,
  getTopProducts,
} = require('../controllers/productController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();

router.route("/").post(protect, admin, createProduct).get(getProducts);

router.get("/top", getTopProducts);

router.route("/:id/reviews").post(protect, createReview);

router
  .route("/:id")
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct)
  .get(getProductById);

module.exports = router;