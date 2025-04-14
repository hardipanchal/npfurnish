import Product from "../models/productModel.js";
import Category from "../models/categoryModel.js";

// ✅ Create a new product
export const createProduct = async (req, res) => {
  try {
    console.log("🟢 Request Body:", req.body);
    console.log("🟢 Uploaded File:", req.file);

    const { name, typeId, description, price, inStock, quantity } = req.body;
    const image = req.file ? req.file.filename : null;

    if (
      !name ||
      !typeId ||
      !description ||
      !image ||
      price === undefined ||
      inStock === undefined ||
      quantity === undefined
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required, including quantity!" });
    }

    // ✅ Check if the category exists
    const categoryExists = await Category.findById(typeId);
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category ID!" });
    }

    // ✅ Prevent duplicate product in same category
    const existingProduct = await Product.findOne({
      name,
      typeId,
      isDeleted: false,
    });
    if (existingProduct) {
      return res.status(409).json({
        message: "Product with the same name already exists in this category.",
      });
    }

    // ✅ Create new product
    const newProduct = new Product({
      name,
      typeId,
      description,
      image,
      price: Number(price),
      inStock,
      quantity: Number(quantity),
    });

    await newProduct.save();

    console.log("✅ Product Created Successfully:", newProduct);
    res.status(201).json({
      message: "Product created successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    res.status(500).json({
      message: "Error creating product",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ✅ Get all products
export const getProducts = async (req, res) => {
  try {
    const { category } = req.query;
    let query = { isDeleted: false };

    if (category) {
      console.log(`Searching for category: ${category}`); // Log category being searched

      // Case-insensitive partial match for category based on typeName
      const categoryDoc = await Category.findOne({
        typeName: { $regex: category, $options: "i" }, // Partial match, case-insensitive
      });

      if (categoryDoc) {
        console.log(`Category found: ${categoryDoc.typeName}`); // Log category found
        query.typeId = categoryDoc._id; // Use the category's _id for the query
      } else {
        console.log(`Category not found: ${category}`); // Log if category not found
        return res.status(404).json({ message: `Category '${category}' not found` });
      }
    }

    // Fetch products based on query
    const products = await Product.find(query)
      .populate({ path: "typeId", select: "typeName" }) // Ensure this is populated correctly
      .select("name typeId description image price inStock quantity");

    const baseUrl = "http://localhost:8000";

    // Format product data
    const formattedProducts = products.map((product) => ({
      _id: product._id,
      name: product.name,
      description: product.description,
      image: product.image
        ? `${baseUrl}/images/${product.image}`
        : `${baseUrl}/fallback.jpg`,
      price: product.price,
      inStock: product.inStock,
      quantity: product.quantity,
      category:
        product.typeId && product.typeId.typeName
          ? product.typeId.typeName
          : "Unknown",
    }));

    res.status(200).json(formattedProducts);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};






// ✅ Get product by ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("typeId", "name")
      .lean();

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    const baseUrl = "http://localhost:8000";
    product.image = product.image
      ? `${baseUrl}/images/${product.image}`
      : `${baseUrl}/fallback.jpg`;

    res.status(200).json({
      ...product,
      category: product.typeId?.name || "Unknown",
    });
  } catch (error) {
    console.error("❌ Error fetching product by ID:", error);
    res.status(500).json({
      message: "Error fetching product",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};


// ✅ Update product
export const updateProduct = async (req, res) => {
  try {
    const { name, typeId, description, price, inStock, quantity } = req.body;
    const image = req.file ? req.file.filename : undefined;

    if (typeId) {
      const categoryExists = await Category.findById(typeId);
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category ID!" });
      }
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (typeId) updateData.typeId = typeId;
    if (description) updateData.description = description;
    if (price !== undefined) updateData.price = Number(price);
    if (inStock !== undefined) updateData.inStock = inStock;
    if (quantity !== undefined) updateData.quantity = Number(quantity);
    if (image) updateData.image = image;

    const product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });

    if (!product || product.isDeleted) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// ✅ Soft delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product soft deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

// 🔍 Search products by name
export const searchProductsByName = async (req, res) => {
  try {
    const query = req.query.q?.trim();

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    console.log("🔍 Searching for:", query);

    // Split query into individual words
    const terms = query.split(/\s+/); // split by spaces
    const regexFilters = terms.map(term => ({
      name: { $regex: new RegExp(term, "i") }
    }));

    const results = await Product.find({
      $and: regexFilters,
      isDeleted: false,
    }).select("name _id image price quantity");

    console.log("✅ Found results:", results.length);

    const baseUrl = "http://localhost:8000";

    const formattedResults = results.map((product) => {
      const imagePath = product.image?.startsWith("http")
        ? product.image
        : `${baseUrl}/images/${product.image || "fallback.jpg"}`;

      return {
        ...product._doc,
        image: imagePath,
        quantity: product.quantity,
      };
    });

    res.status(200).json(formattedResults);
  } catch (error) {
    console.error("❌ Error searching products:", error);
    res.status(500).json({
      message: "Error searching products",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

