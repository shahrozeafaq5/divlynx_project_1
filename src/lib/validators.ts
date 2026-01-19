import { z } from "zod";

export const BookValidator = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  description: z.string().optional(),
  category: z.enum(["philosophy", "poetry", "history", "fiction", "essays"]),
  price: z.number().positive("Price must be greater than 0"),
  image: z.string().url().optional(),
  coverImage: z.string().url().optional(),
  rating: z.number().min(0).max(5).optional(),
  stock: z.number().min(0),
});
