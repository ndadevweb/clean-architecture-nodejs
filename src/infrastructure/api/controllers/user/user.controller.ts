import { Body, Controller, Post, Response, Route, SuccessResponse, Tags } from "tsoa";
import { PostUserInputDto, PostUserOutputDto } from "./dto";
import { createUserCodec } from "./user.codec";
import SignInUserUseCase from "../../../../core/use-cases/sign-in-user.use-case";
import SignUpUserUseCase from "../../../../core/use-cases/sign-up-user.use-case";
import { ConflictError, InvalidInputError, NotFoundError } from "../../errro-handler";

@Route('users')
@Tags('Users')
export class UserController extends Controller {

    constructor() {
        super()
    }

    @Post('/signup')
    @SuccessResponse(200)
    @Response(400, 'Invalid request params')
    @Response(404, 'Not Found')
    async signup(
        @Body() requestBody: PostUserInputDto
    ): Promise<PostUserOutputDto> {
        const decodingResult = createUserCodec.decode(requestBody)

        if(!decodingResult.success) {
            throw new InvalidInputError(decodingResult.error.toString())
        }

        const user = await new SignUpUserUseCase().execute(decodingResult.data)

        if(user === 'USER_ALREADY_EXISTS') {
            throw new ConflictError('USER_ALREADY_EXISTS')
        }

        return user
    }

    @Post('/signin')
    @SuccessResponse(200)
    @Response(400, 'Invalid request params')
    @Response(409, 'Already exists')
    async signin(
        @Body() requestBody: PostUserInputDto
    ): Promise<PostUserOutputDto> {
        const decodingResult = createUserCodec.decode(requestBody)

        if(!decodingResult.success) {
            throw new InvalidInputError(decodingResult.error.toString())
        }

        const user = await new SignInUserUseCase().execute(
            decodingResult.data.login,
            decodingResult.data.password
        )

        if(user === 'USER_NOT_FOUND') {
            throw new NotFoundError('USER_NOT_FOUND')
        }

        return user
    }
}
