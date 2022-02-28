import { array, number, object, string, TypeOf, z } from "zod";

export const productSizeEnum = ["xs", "s", "m", "l", "xl"] as const;

export const productSchema = object({
  body: object({
    productDetails: object({
      name: string({ required_error: "Name is required" }).max(
        30,
        "Name must not be more than 30 characters"
      ),
      desc: string({ required_error: "Desc is required" }),
    }),
    stock: array(
      object({
        size: z.enum(productSizeEnum),
        price: number({ required_error: "Price is required" }).min(
          0,
          "Price can not be less than zero"
        ),
        quantity: number({ required_error: "Quantity is required" }).min(
          0,
          "Quantity can not be less than zero"
        ),
      })
    ).superRefine((value, ctx) => {
      let count: number;
      productSizeEnum.map((enumVal) => {
        count = 0;
        value.map((data) => {
          if (count > 1) return;
          if (enumVal === data.size) count++;
        });
        if (count > 1) {
          ctx.addIssue({ code: "custom", message: "Can not repeat same size" });
        }
      });
    }),
  }),
});

export const cartSchema = object({
  body: object({
    productId: string({ required_error: "productId is required" }),
  }),
});

export type ProductInput = TypeOf<typeof productSchema>["body"];
export type CartInput = TypeOf<typeof cartSchema>["body"];
