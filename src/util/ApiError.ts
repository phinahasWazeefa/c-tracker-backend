export class ApiError extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // Flags the error as operational (for logging purposes)
        Error.captureStackTrace(this, this.constructor); // For better stack trace
    }
}
