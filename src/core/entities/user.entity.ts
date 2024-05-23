import { createHmac, verify } from "crypto"
import { sign } from "jsonwebtoken"
import { env } from "process"
import { z } from "zod"

const ConfigSchema = z.object({
    secret: z.string().min(1),
    salt: z.string().min(1)
})

type UserConfig = z.infer<typeof ConfigSchema>

abstract class User {

    protected readonly config: UserConfig

    constructor() {
        this.config = ConfigSchema.parse({
            secret: env['JWT_SECRET'],
            salt: env['USER_SALT']
        })
    }
}

type ExistingUserConstructorArgs = {
    id: string
}

export class ExistingUser extends User {

    private userId: string

    constructor({ id }: ExistingUserConstructorArgs) {
        super()
        this.userId = id
    }

    public signAndEncodeUserAccessToken() {
        const accessToken = sign({ sub: this.userId }, this.config.secret, { expiresIn: 86400 })

        return accessToken
    }

    public get id() {
        return this.userId
    }
}

export class NotExistingUser extends User {
    constructor() {
        super()
    }

    public hashPassword(notHashedPassword: string) {
        const hmac = createHmac('sha512', this.config.salt)
        hmac.update(notHashedPassword)

        return hmac.digest('hex')
    }

    public verifyAndDecoderUserAccessToken(accessToken: string): { id: string } {
        const { sub } = verify(accessToken, this.config.secret)

        if(sub && typeof sub === "string") {
            return { id: sub }
        }

        throw "Expect a 'sub' property in jwt token payload"
    }
}