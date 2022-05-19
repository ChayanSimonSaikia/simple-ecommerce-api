import {
  prop,
  getModelForClass,
  Severity,
  modelOptions,
  mongoose,
} from "@typegoose/typegoose";
import { productSizeEnum } from "../schema/product.schema";

export class Stock {
  @prop({ required: true, enum: productSizeEnum })
  size: string;
  @prop({ required: true, min: 0 })
  price: number;
  @prop({ required: true, min: 0 })
  quantity: number;
}

class ProductDetails {
  @prop({
    required: true,
    maxlength: 30,
    unique: true,
  })
  name: string;

  @prop({ required: true })
  desc: string;

  @prop({ required: true })
  image: string;
}

// TODO: Add category
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class Product {
  @prop({ auto: true })
  _id: mongoose.Types.ObjectId;

  @prop({ required: true, type: Object })
  productDetails: ProductDetails;

  @prop()
  stock: Array<Stock>;
}

const ProductModel = getModelForClass(Product, {
  schemaOptions: { timestamps: true },
});

export default ProductModel;
