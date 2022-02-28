import { getModelForClass, mongoose, pre, prop, Ref, } from "@typegoose/typegoose";
import { Product, Stock } from "./Product.model";
import { User } from "./User.model";

@pre<Items>("save", async function(){
        const product= await this.populate<Product>("productId");
        const {price}= product.stock.filter((stock)=>{
                return stock.size === "s"
        })[0];
        this.totalPrice = price*this.quantity;
})
class Items {
        @prop({ref: ()=> Product, required:true})
        productId: Ref<Product>

        @prop({required: true})
        size: string

        @prop({required: true})
        totalPrice: number

        @prop({min: 0})
        quantity: number
}

export class Cart{
        @prop({_id: true, ref: ()=> User, required:true})
        user: Ref<User>

        @prop({required:true})
        items: mongoose.Types.Array<Items>
        
}       
export const CartModel = getModelForClass(Cart, {schemaOptions: {timestamps: true}})