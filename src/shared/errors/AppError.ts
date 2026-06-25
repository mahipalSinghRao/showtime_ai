export class AppError extends Error {
    public readonly statusCode: number;
    public readonly success: boolean;
    public readonly isOperational: boolean;

    constructor(
        message: string,
        statusCode: number = 500,
        isOperational: boolean = true,
    ) {
        super(message);

        this.statusCode = statusCode;
        this.success = false,
        this.isOperational = isOperational

        Error.captureStackTrace(this, this.constructor)
    }
}