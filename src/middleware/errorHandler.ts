// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../util/ApiError';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {

    console.log("Reached errorHandler")

    // // Log the error if it's operational, otherwise don't log system errors
    // if (err instanceof ApiError) {
    //     // Log operational errors (errors that we expect and handle in business logic)
    //     console.error(err);
    // } else {
    //     // Log unexpected errors
    //     console.error('Unexpected Error: ', err);
    // }

    // If the error is operational, send it with the defined status code
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    } else {
        // If it's a non-operational error (like a system issue), send a generic response
        res.status(500).json({
            status: 'error',
            message:err.message //'Something went wrong! Please try again later.',
        });
    }
};
