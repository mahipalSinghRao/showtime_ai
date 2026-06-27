class ApiResponse<T> {
    success: boolean;
    // statusCode: number;
    // message: string;
    // data: T | null;

    constructor(
        public statusCode: number,
        public message: string,
        public data: T | null,
    ) {
        this.success = statusCode < 400;
        // this.statusCode = statusCode;
        // this.message = message;
        // this.data = data
    }
}

export default ApiResponse;