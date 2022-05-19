import { array, number, object, string, TypeOf, z } from "zod";

export const productSizeEnum = ["xs", "s", "m", "l", "xl"] as const;

export const productSchema = object({
  body: object({
    name: string({ required_error: "Name is required" }).max(
      30,
      "Name must not be more than 30 characters"
    ),
    desc: string({ required_error: "Desc is required" }),
    size: z.enum(productSizeEnum),
    price: number({ required_error: "Price is required" }).min(
      0,
      "Price can not be less than zero"
    ),
    quantity: number({ required_error: "Quantity is required" }).min(
      0,
      "Quantity can not be less than zero"
    ),
  }).superRefine((value, ctx) => {
    let count: number;
    productSizeEnum.map((enumVal) => {
      count = 0;

      if (count > 1) return;
      if (enumVal === value.size) count++;

      if (count > 1) {
        ctx.addIssue({ code: "custom", message: "Can not repeat same size" });
      }
    });
  }),
});

export const cartSchema = object({
  body: object({
    productId: string({ required_error: "productId is required" }),
  }),
});

export type ProductInput = TypeOf<typeof productSchema>["body"];
export type CartInput = TypeOf<typeof cartSchema>["body"];
