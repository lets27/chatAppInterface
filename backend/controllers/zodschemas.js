import { z } from "zod";

const zodEmailSchema = z.string().email().max(50).toLowerCase().trim();
const zodUsernameSchema = z
  .string()
  .min(4)
  .max(30)
  .regex(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  })
  .toLowerCase()
  .trim();

const zodCreateUser = z.object({
  username: zodUsernameSchema,
  password: z.string().min(6).max(30),
  email: zodEmailSchema,
  picture: z
    .instanceof(Buffer)
    .optional()
    .refine(
      (file) => !file || ["image/jpeg", "image/png"].includes(file.type),
      { message: "Only JPEG and PNG images are allowed" }
    ),
});

export { zodCreateUser, zodEmailSchema, zodUsernameSchema };
