import {
  DocumentType,
  getModelForClass,
  pre,
  prop,
  Ref,
  mongoose,
  modelOptions,
  Severity,
} from "@typegoose/typegoose";
import argon2 from "argon2";
import createHttpError from "http-errors";
import { Product } from "./Product.model";

export class Cart {
  @prop({ ref: () => Product })
  productId: Ref<Product>;

  @prop()
  quantity: number;
}

@pre<User>("save", async function () {
  // is admin
  if (
    this.isModified("email") &&
    this.email.toLowerCase() === "chayansimon9@gmail.com"
  )
    this.isAdmin = true;

  // Password hashing
  if (!this.isModified("password")) return;
  const hash = await argon2.hash(this.password);
  this.password = hash;
})
@modelOptions({ options: { allowMixed: Severity.ALLOW } })
export class User {
  @prop({ required: true })
  firstName: string;

  @prop({ required: true })
  lastName: string;

  @prop({ required: true, unique: true, lowercase: true, index: true })
  email: string;

  @prop({ required: true })
  password: string;

  @prop({ default: false })
  verified: boolean;

  @prop({ default: false })
  isAdmin: boolean;

  @prop({ default: [] })
  cart: Array<Cart>;

  async comparePassword(this: DocumentType<User>, candidatePassword: string) {
    try {
      return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
      console.log(error, "Password compare method failed");
      throw new createHttpError.InternalServerError("Something went wrong");
    }
  }

  async addToCart(
    this: DocumentType<User>,
    productId: mongoose.Types.ObjectId
  ) {
    const updatedCart = [...this.cart];
    let itemIndex;
    updatedCart.every((val, i) => {
      const prodId = val.productId;
      if (!prodId) return false;
      if (productId.equals(prodId._id)) {
        itemIndex = i;
        return false;
      }
      return true;
    });
    if (itemIndex === undefined) {
      updatedCart.push({ productId, quantity: 1 });
      this.cart = updatedCart;
      return this.save();
    }
    console.log(this.populate(`cart.${itemIndex}.productId`));
    updatedCart[itemIndex] = {
      productId,
      quantity: updatedCart[itemIndex].quantity + 1,
    };
    this.cart = updatedCart;
    return this.save();
  }
  async deleteCart(
    this: DocumentType<User>,
    productId: mongoose.Types.ObjectId
  ) {
    const updatedCart = [...this.cart];
    let itemIndex;
    updatedCart.every((val, i) => {
      const prodId = val.productId;
      if (!prodId) return false;
      if (productId.equals(prodId._id)) {
        itemIndex = i;
        return false;
      }
      return true;
    });
    if (itemIndex === undefined)
      throw new createHttpError.NotFound("No item found to delete");
    updatedCart.splice(itemIndex, 1);
    this.cart = updatedCart;
    return this.save();
  }
}

const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});

export default UserModel;
