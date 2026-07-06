import { z } from "zod"

export const userUpdateSchema = z.object({
    body: z.object({
        fullName: z.string().trim().min(3, "Full name must be at least 3 characters").max(50).optional(),
        avatar: z.string().url("Invalid  avatar url").optional()
    }),
})

export const passwordChangeSchema = z.object({
    body: z.object({
        password: z.string().min(8).max(32).regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            "Password must contain uppercase, lowercase and a number"
        )
    })
})