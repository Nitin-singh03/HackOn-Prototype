import asyncHandler from "express-async-handler";
import Cart from "../Models/Cart.js"
import Product from "../Models/Product.js";

export const addCartItem = asyncHandler(async (req, res) => {
  const { productId, qty } = req.body;

  if (!productId || typeof qty !== 'number' || qty < 0) {
    res.status(400);
    throw new Error('productId and non‑negative qty are required');
  }

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  let cart = await Cart.findOne();
  if (!cart) {
    cart = new Cart({ items: [] });
  }

  const idx = cart.items.findIndex(
    item => item.product.toString() === productId
  );

  if (qty === 0) {
    // remove
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
  } else if (idx >= 0) {
    // set to qty (clamped to stock)
    cart.items[idx].quantity = Math.min(qty, product.countInStock);
  } else {
    // add new
    cart.items.push({
      product: productId,
      quantity: Math.min(qty, product.countInStock)
    });
  }

  await cart.save();
  cart = await cart.populate('items.product');
  res.json(cart);
});

export const getCart = asyncHandler(async (req, res) => {
  const cart = await Cart.findOne()
    .populate("items.product"); // again, full Product objects

  if (!cart) {
    return res.json({ items: [] });
  }

  res.json(cart);
});
