class ApiError extends Error {
    public statusCode: number;
    public errors: unknown[];
    public success: boolean;

    constructor(
        statusCode: number,
        message: string = "Something went wrong",
        errors: unknown[] = []
    ) {
        super(message);

        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false;

        Error.captureStackTrace(this, this.constructor)
    }
}

export default ApiError