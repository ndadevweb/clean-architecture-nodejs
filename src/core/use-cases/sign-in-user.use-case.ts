import { container } from "tsyringe"
import Logger from "../ports/logger.port"
import { UserRepository } from "../ports/database.port"
import { NotExistingUser } from "../entities/user.entity"

class SignInUser {

    private logger: Logger
    private userRepository: UserRepository

    constructor() {
        this.logger = container.resolve<Logger>("Logger")
        this.userRepository = container.resolve<UserRepository>("UserRepository")
    }

    async execute(
        login: string,
        password: string
    ): Promise<{ accessToken: string }| 'USER_NOT_FOUND'> {
        this.logger.debug('[Get-user usecase] Start')

        const notExistingUser = new NotExistingUser()
        const existingUser = await this.userRepository.findByLoginAndPassword(
            login,
            notExistingUser.hashPassword(password)
        )

        return existingUser
            ? { accessToken: existingUser.signAndEncodeUserAccessToken() }
            : 'USER_NOT_FOUND'
    }
}

export default SignInUser