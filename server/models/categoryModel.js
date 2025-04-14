import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    typeName: { type: String, required: true },
    isDeleted: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
