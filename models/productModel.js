const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema(
     {
          name: { type: String, required: true },
          rating: { type: Number, required: true },
          comment: { type: String, required: true },
          user: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: "User",
          },
     },
     {
          timestamps: true,
     }
);

const productSchema = mongoose.Schema(
     {
          user: {
               type: mongoose.Schema.Types.ObjectId,
               required: true,
               ref: "User",
          },
          name: {
               type: String,
               required: true,
               unique: true,
               min: [6, 'Too few '],
               max: 30
          },
          description: {
               type: String,
               required: true,
          },
          price: {
               type: Number,
               required: true,
          },
          time: {
               type: Number,
               required: true,
          },
          portion: {
               type: Number,
               required: true,
          },
          category: {
               type: String,
               enum: {
                    values: ['Coffee', 'Tea', 'Pizza', 'Burger'],
                    message: '{VALUE} is not supported'
               },
               required: true,
          },
          image: {
               type: String,
               required: true,
          },
          reviews: [reviewSchema],
          rating: {
               type: Number,
               default: 0,
          },
          numReviews: {
               type: Number,
               default: 0,
          },
     },
     {
          timestamps: true,
     }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;

