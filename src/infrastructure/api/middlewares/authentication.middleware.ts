import { Request } from "express";
import { AuthenticatedContext } from "../../../core/ports/api.port";
import { container } from "tsyringe";
import { UserRepository } from "../../../core/ports/database.port";
import { ExistingUser, NotExistingUser } from "../../../core/entities/user.entity";

const extractTokenFromRequest = (request: Request): "TOKEN_NOT_FOUND" | string => {
    return (request.header('authorization') ?? '').replace('Bearer ', '') || "TOKEN_NOT_FOUND"
}

const verifyAndDecodeJwt = (token: string): "INVALID_JWT" | { id: string } => {
    try {
        const notExistUser = new NotExistingUser()

        return notExistUser.verifyAndDecoderUserAccessToken(token)
    } catch(error) {
        return "INVALID_JWT"
    }
}

const retrieveUserFromId = async (id: string): Promise<"UNKNOWN_USER" | ExistingUser> => {
    const userRepository = container.resolve<UserRepository>("UserRepository")

    return (await userRepository.findById(id)) || "UNKNOWN_USER"
}

const getUserFromJwt = async (token: string): Promise<"INVALID_JWT" | "UNKNOWN_USER" | { userId: string }> => {
    const payload = verifyAndDecodeJwt(token)

    if(payload === "INVALID_JWT") {
        return payload
    }

    const user = await retrieveUserFromId(payload.id)

    if(user === "UNKNOWN_USER") {
        return user
    }

    return {
        userId: user.id
    } 
}

export async function expressAuthentication(
    request: Request,
    securityName: string,
    scopes: string[]
): Promise<AuthenticatedContext> {
    const token = extractTokenFromRequest(request)

    if(token === 'TOKEN_NOT_FOUND') {
        return Promise.reject(new Error("Missing authentication"))
    }

    const user = await getUserFromJwt(token)

    if(user === 'INVALID_JWT' || user === 'UNKNOWN_USER') {
        return Promise.reject('Invalid Token')
    }

    return Promise.resolve(user)
}