import { AnyZodObject, ZodError } from "zod/v3";
import { NextFunction, Request, Response } from "express";

export const validate = (schema: AnyZodObject) => async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        // req.body = schema.parse(req.body)
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).json({
                success: false,
                message: "Validation Failed",
                error: error.issues
            })
        }
        next(error)
    }
}
