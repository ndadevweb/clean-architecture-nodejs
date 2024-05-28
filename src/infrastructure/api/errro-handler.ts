import { NextFunction, Request, Response } from "express";

export class ConflictError extends Error {}
export class NotFoundError extends Error {}
export class InvalidInputError extends Error {}
export class ForbiddenError extends Error {}
export class UnauthorizedError extends Error {}

export const errorHandler = (
    err: unknown,
    req: Request,
    res: Response,
    next: NextFunction
): Response | void => {
    if(err instanceof ConflictError) {
        return res.status(409).json({
            message: err.message
        })
    }

    if(err instanceof InvalidInputError) {
        return res.status(400).json({
            message: err.message
        })
    }

    if(err instanceof UnauthorizedError) {
        return res.status(401).json({
            message: err.message
        })
    }

    if(err instanceof ForbiddenError) {
        return res.status(403).json({
            message: err.message
        })
    }

    if(err instanceof NotFoundError) {
        return res.status(404).json({
            message: err.message
        })
    }

    if(err instanceof Error) {
        return res.status(500).json({
            message: 'Internal Server Error',
            error: err.message
        })
    }

    next()
}