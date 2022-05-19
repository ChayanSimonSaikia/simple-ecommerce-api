import { Router } from "express";
import { imageUpload } from "../../utils/muterConfig";
import {
  addProductHandler,
  addToCartHandler,
  deleteCartHadnler,
  getAllProductHandler,
  getCartHandler,
  getProductHandler,
  searchProductHandler,
} from "../controllers/product.controller";
import { isAdmin, isVerified, requireLogin } from "../middlewares/requireAuth";
import { validateResources } from "../middlewares/validateResources";
import { cartSchema, productSchema } from "../schema/product.schema";
const router = Router();

/* GET */
router.get("/products", getAllProductHandler);
router.get("/product/:prodId", getProductHandler);
router.get("/product", searchProductHandler);
router.get("/getCart", requireLogin, getCartHandler);

/* POST */
router.post(
  "/addProduct",
  requireLogin,
  isAdmin,
  imageUpload.single("image"),
  addProductHandler
);

router.post(
  "/addToCart",
  requireLogin,
  isVerified,
  validateResources(cartSchema),
  addToCartHandler
);
router.delete(
  "/deleteCart",
  requireLogin,
  validateResources(cartSchema),
  deleteCartHadnler
);

export default router;
