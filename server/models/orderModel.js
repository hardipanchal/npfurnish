import mongoose from "mongoose";

// Define the Order schema
const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    refId: {
      type: String,
      required: true,
      unique: true,
      trim: true, // Clean refId string
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    productIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    status: {
  type: String,
  enum: ["Pending", "Confirmed", "Delivered", "Cancelled"], // ✅ Added "Cancelled"
  default: "Pending",
},

    inCart: {
      type: Boolean,
      default: false,
    },
    isConfirm: {
      type: Boolean,
      default: false,
    },
    isCancelled: {
      type: Boolean,
      default: false,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create the model from the schema
const Order = mongoose.model("Order", orderSchema);

export default Order;
