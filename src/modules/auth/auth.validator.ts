import { z } from "zod"

export const registerSchema = z.object({
    body: z.object({
        fullName: z.string().trim().min(3, "Full name must be at least 3 characters").max(50),
        username: z.string().trim().toLowerCase().min(3).max(50).regex(
            /^[a-z0-9_]+$/,
            "Username can only contain lowercase letters, numbers and underscores"
        ),
        email: z.string().trim().email(),
        password: z.string().min(8).max(32).regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
            "Password must contain uppercase, lowercase and a number"
        )
    })
})

export const loginSchema = z.object({
    body: z.object({    
        email: z.string().trim().email(),
        password: z.string().min(8).max(32)
    })
})