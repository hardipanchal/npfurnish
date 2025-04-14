// routes/productRoutes.js

import express from "express";
import uploadMiddleware from "../middlewares/imagesMiddleware.js";
import * as productController from "../controllers/productController.js";

const router = express.Router();

router.post("/", uploadMiddleware, productController.createProduct);
router.get("/", productController.getProducts);

// IMPORTANT: keep search route before /:id
router.get("/search", productController.searchProductsByName);

router.get("/:id", productController.getProductById);
router.put("/:id", uploadMiddleware, productController.updateProduct);
router.delete("/:id", productController.deleteProduct);

export default router;
