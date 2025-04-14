import Cart from "../models/cartModel.js";

// ✅ Add Product to Cart
export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const newCartItem = new Cart({
      userId,
      productId,
    });

    await newCartItem.save();
    res.status(201).json({ message: "Product added to cart successfully!", cartItem: newCartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

// ✅ Get All Cart Items (Non-Deleted)
export const getCartItems = async (req, res) => {
  try {
    const cartItems = await Cart.find({ isDeleted: false })
      .populate("userId", "name")
      .populate("productId", "name price");
    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching cart items", error: error.message });
  }
};

// ✅ Get Cart Items by User ID
export const getCartItemsByUser = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.params.userId, isDeleted: false })
      .populate("productId", "name price");
    if (!cartItems.length) {
      return res.status(404).json({ message: "No items found in cart" });
    }
    res.status(200).json(cartItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching user's cart", error: error.message });
  }
};

// ✅ Remove Product from Cart (Soft Delete)
export const removeFromCart = async (req, res) => {
  try {
    const cartItem = await Cart.findById(req.params.id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.isDeleted = true;
    await cartItem.save();

    res.status(200).json({ message: "Item removed from cart successfully", cartItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error removing item from cart", error: error.message });
  }
};

// ✅ Clear User Cart (Soft Delete All Items)
export const clearCart = async (req, res) => {
  try {
    await Cart.updateMany({ userId: req.params.userId }, { isDeleted: true });

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error clearing cart", error: error.message });
  }
};
