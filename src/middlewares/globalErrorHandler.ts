import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction) {


    let statusCode = 500;
    let errorMessage = "Internal server error!";
    let errorDetails = err;

    if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = 400;
        errorMessage = "You provided incorrect field type or missing fields!";
    }
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2025") {
            statusCode = 400;
            errorMessage = "The requested item does not exist.!";
        }
        else if (err.code === "P2002") {
            statusCode = 400;
            errorMessage = "Duplicate key error!";
        }
        else if (err.code === "P2003") {
            statusCode = 400;
            errorMessage = "Foreign key constraint failed!";
        }
    }
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = 500;
        errorMessage = "Error occured during query exucution!";
    }
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = 500;
        errorMessage = "Something went wrong on our end. Please try again later!";
    }
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        if (err.errorCode === "P1000") {
            statusCode = 401;
            errorMessage = "Authentication failed. Please check your crendentials!";
        }
        else if (err.errorCode === "P1001") {
            statusCode = 401;
            errorMessage = "Can't reach database server!";
        }
        // default error for PrismaClientInitializationError
        else {
            statusCode = 500;
            errorMessage = "The service is temporarily unavailable. Please try again later.!";
        }
    }
    res.status(statusCode);
    res.json({
        message: errorMessage,
        error: errorDetails
    })
}

export default errorHandler;