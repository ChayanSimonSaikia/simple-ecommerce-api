import { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import ProductModel, { Product } from "../models/Product.model";
import { User } from "../models/User.model";
import { CartInput, ProductInput } from "../schema/product.schema";
import { findUserById } from "../services/auth.service";
import {
  addProduct,
  findProductById,
  findProductByNameAndDesc,
  findRecentProducts,
  findTotalProducts,
} from "../services/product.service";

export const addProductHandler = async (
  req: Request<{}, {}, ProductInput>,
  res: Response,
  next: NextFunction
) => {
  try {
    await addProduct(req.body);
    res.json({ message: "Product added to the shop" });
  } catch (error) {
    next(error);
  }
};

export const getAllProductHandler = async (
  req: Request<{}, {}, {}, { page: string }>,
  res: Response,
  next: NextFunction
) => {
  const currentPage = +req.query.page || 1;
  const productPerPage = 2;

  try {
    const products = await findRecentProducts(currentPage, productPerPage);
    if (products.length === 0)
      throw new createHttpError.NotFound("Page not found");

    const totalProducts = await findTotalProducts();
    res.json({ message: "Fetched all products", products, totalProducts });
  } catch (error) {
    next(error);
  }
};

export const getProductHandler = async (
  req: Request<{ prodId: string }>,
  res: Response,
  next: NextFunction
) => {
  if (!req.params.prodId)
    next(new createHttpError.NotFound("No product found"));
  try {
    const product = await findProductById(req.params.prodId);
    if (!product) throw new createHttpError.NotFound("No product found");

    res.json({ message: "Product fetched successfully", product });
  } catch (error) {
    next(error);
  }
};

export const searchProductHandler = async (
  req: Request<{}, {}, {}, { search: string; page: string }>,
  res: Response,
  next: NextFunction
) => {
  const item = req.query.search;
  const currentPage = +req.query.page || 1;
  const productsPerPage = 2;

  try {
    const products = await findProductByNameAndDesc(item, {
      currentPage,
      productsPerPage,
    });
    if (products.length === 0)
      throw new createHttpError.NotFound("No result found");

    res.json({ products });
  } catch (error) {
    next(error);
  }
};

export const addToCartHandler = async (
  req: Request<{}, {}, CartInput>,
  res: Response,
  next: NextFunction
) => {
  const user = res.locals.user;

  try {
    const product = await findProductById(req.body.productId);
    if (!product) return next(new createHttpError.NotFound("No product found"));

    await user.addToCart(product._id);

    res.json({ message: "Added to the cart" });
  } catch (error) {
    next(error);
  }
};

export const getCartHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  try {
    const user = await findUserById(userId);
    if (!user) throw new createHttpError.InternalServerError();
    if (user.cart.length === 0)
      throw new createHttpError.NotFound("No items added to the cart");
    const populatedCart = await user.populate<{
      cart: [{ productId: Product }];
    }>({
      path: "cart",
      populate: {
        path: "productId",
        model: ProductModel,
      },
    });
    res.json({ message: "Fetched successfully", cart: populatedCart.cart });
  } catch (error) {
    next(error);
  }
};

export const deleteCartHadnler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = res.locals.userId;
  try {
    const product = await findProductById(req.body.productId);
    if (!product) return next(new createHttpError.NotFound("No product found"));

    const user = await findUserById(userId);
    if (!user) throw new createHttpError.InternalServerError();

    if (user.cart.length === 0)
      throw new createHttpError.NotFound("No items found in the cart");

    await user.deleteCart(product._id);

    res.json({ message: "Deleted from the cart" });
  } catch (error) {
    next(error);
  }
};
