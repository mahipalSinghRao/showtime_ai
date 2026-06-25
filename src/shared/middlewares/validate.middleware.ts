import { AnyZodObject } from "zod/v3";
import { NextFunction, Request, Response } from "express";

const validate = (schema: AnyZodObject) => async (req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params
        })
        next()
    } catch (error) {
        next(error)
    }
}
export default validate