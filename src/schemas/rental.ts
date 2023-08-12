import { z } from "zod";

export const CreateRentalSchema = z.object({
  name: z.string(),
  type: z.enum(["drums", "guitar", "bass", "keyboard", "microphone"]),
  description: z.string().nullish(),
});

export type Rental = z.infer<typeof CreateRentalSchema>;
