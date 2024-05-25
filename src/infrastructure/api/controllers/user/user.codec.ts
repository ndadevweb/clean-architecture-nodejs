import { PostUserInputDto } from "./dto";

export const createUserCodec = {
    decode: (params: unknown) => PostUserInputDto.safeParse(params)
}