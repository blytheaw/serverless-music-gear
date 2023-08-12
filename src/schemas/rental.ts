import { z } from "zod";

export const CreateRentalSchema = z.object({
  name: z.string(),
  type: z.enum(["drums", "guitar", "bass", "keyboard", "microphone"]),
  description: z.string().nullish(),
});

export const UpdateRentalSchema = z.object({
  id: z.string().uuid(),
  description: z.string().nullish(),
  status: z.enum(["available", "rented"]),
});

export type CreateRental = z.infer<typeof CreateRentalSchema>;
export type UpdateRental = z.infer<typeof UpdateRentalSchema>;
