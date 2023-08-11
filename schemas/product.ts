import { z } from "zod";

export const CreateProductSchema = z.object({
  name: z.string(),
  description: z.string().nullish(),
  type: z.string(),
  condition: z.enum(["new", "preowned"]),
  price: z.number(),
});

export type Product = z.infer<typeof CreateProductSchema>;
