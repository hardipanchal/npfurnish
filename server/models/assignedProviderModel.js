import mongoose from "mongoose";

const assignedProviderSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming 'User' model includes providers
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deliveryIssue: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const AssignedProvider = mongoose.model("AssignedProvider", assignedProviderSchema);

export default AssignedProvider;
