import ProductModel from "../models/Product.model";
import { ProductInput } from "../schema/product.schema";

export const addProduct = (input: ProductInput) => {
  return ProductModel.create(input);
};

export const findTotalProducts = () => {
  return ProductModel.find().countDocuments();
};

export const findRecentProducts = (
  currentPage: number,
  productsPerPage: number
) => {
  return ProductModel.find()
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * productsPerPage)
    .limit(productsPerPage);
};

export const findProductById = (id: string) => {
  return ProductModel.findById(id);
};

export const findProductByNameAndDesc = (
  item: string,
  {
    currentPage,
    productsPerPage,
  }: { currentPage: number; productsPerPage: number }
) => {
  const regexQuery = [
    { name: new RegExp(item, "i") },
    { desc: new RegExp(item, "i") },
  ];
  return ProductModel.find({ $or: regexQuery })
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * productsPerPage)
    .limit(productsPerPage);
};
