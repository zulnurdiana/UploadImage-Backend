import express from "express";
import {
  getProducts,
  getProductsById,
  saveProducts,
  deleteProducts,
  updateProducts,
} from "../controllers/ProductController.js";

const route = express.Router();

route.get("/product", getProducts);
route.get("/product/:id", getProductsById);
route.post("/product", saveProducts);
route.delete("/product/:id", deleteProducts);
route.put("/product/:id", updateProducts);

export default route;
