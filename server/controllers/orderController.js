import Order from "../models/orderModel.js";
import mongoose from 'mongoose';
import Product from "../models/productModel.js"; 
// Create an order
export const createOrder = async (req, res) => {
  try {
    const {
      productIds, 
      status,
      inCart,
      isConfirm,
      isCancelled,
      isDelivered,
      isDeleted,
      address,
    } = req.body;

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Ensure productIds is valid and not empty
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ message: "Product IDs are required." });
    }

    // Validate each productId is a valid ObjectId
    productIds.forEach(id => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: `Invalid product ID: ${id}` });
      }
    });

    // Convert productIds to ObjectId (using 'new' with Types.ObjectId)
    const productObjectIds = productIds.map(id => new mongoose.Types.ObjectId(id));

    // Ensure that product IDs are valid (exist in the Product collection)
    const products = await Product.find({ '_id': { $in: productObjectIds } });
    if (products.length !== productObjectIds.length) {
      return res.status(400).json({ message: "Some product IDs are invalid." });
    }

    // Generate a unique order refId
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const random = Math.floor(1000 + Math.random() * 9000);
    const refId = `ORDER${date}-${random}`;

    // Create the order with ObjectIds
    const newOrder = new Order({
      userId,
      refId,
      address,
      productIds: productObjectIds, // Ensure this is an array of ObjectIds
      status,
      inCart,
      isConfirm,
      isCancelled,
      isDelivered,
      isDeleted,
    });

    // Save the order
    await newOrder.save();

    // Populate productIds after saving the order
    const savedOrder = await Order.findById(newOrder._id).populate({
      path: "productIds",
      select: "name price"
    });

    // Return the response
    res.status(201).json({ message: "Order created successfully!", order: savedOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error: error.message });
  }
};


// Get all orders (excluding soft-deleted ones)
export const getOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    const role = req.user?.role;

    if (!userId || !role) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const query = role === "admin" 
      ? { isDeleted: false } 
      : { userId, isDeleted: false };

    // Fetch orders with populated userId and productIds
    const orders = await Order.find(query)
      .populate({
        path: "userId",
        select: "name",
        strictPopulate: false
      })
      .populate({
        path: "productIds",
        select: "name price",
        strictPopulate: false
      });

    // Log the populated orders to check if product data is present
    console.log("Orders with populated productIds:", orders);

    // Calculate total price for each order
    const ordersWithTotalPrice = orders.map(order => {
      const totalPrice = order.productIds.reduce((total, product) => total + product.price, 0);
      return { ...order.toObject(), totalPrice };
    });

    res.status(200).json(ordersWithTotalPrice);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    res.status(500).json({ message: "Error fetching orders", error: error.message });
  }
};





// Get single order by ID (with user & product populated)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("userId", "name")
      .populate("productId", "price name");

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("Fetched order:", order); // Confirm it includes the address
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Error fetching order", error: error.message });
  }
};


// 🔐 Get orders for the logged-in user
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?._id;

    const myOrders = await Order.find({ userId, isDeleted: false })
      .populate("productIds", "name price") // adjust if you want more fields
      .sort({ createdAt: -1 });

    res.status(200).json(myOrders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Error fetching user orders", error: error.message });
  }
};


// Update order
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating order", error: error.message });
  }
};

// Soft delete order
export const deleteOrder = async (req, res) => {
    try {
      // Find the order by its ID
      const order = await Order.findById(req.params.id);
  
      // Check if the order exists
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      // Update the order to mark it as deleted
      order.isDeleted = true;
      await order.save();
  
      res.status(200).json({ message: "Order deleted successfully", order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting order", error: error.message });
    }
  };
  

// Cancel Order
export const cancelOrder = async (req, res) => {
  const orderId = req.params.id;
  const userId = req.user._id;

  try {
    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status === "Delivered" || order.status === "Cancelled") {
      return res.status(400).json({ message: "Cannot cancel this order" });
    }

    order.status = "Cancelled"; // ✅ Capital C
    await order.save();

    res.json({ message: "Order cancelled successfully" });
  } catch (err) {
    console.error("Cancel Order Error:", err);
    res.status(500).json({ message: "Error cancelling order", error: err.message });
  }
};


  

// Confirm order
export const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order || order.isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Update the isConfirm flag to true
    order.isConfirm = true;
    order.status = 'confirmed'; // You can update the status to 'confirmed' as well if needed
    await order.save();

    res.status(200).json({ message: "Order confirmed successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error confirming order", error: error.message });
  }
};
