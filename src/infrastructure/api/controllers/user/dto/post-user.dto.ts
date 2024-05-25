import { z } from "zod";

export const PostUserOutputDto = z.object({
    accessToken: z.string()
})

export type PostUserOutputDto = ReturnType<typeof PostUserOutputDto.parse>

export const PostUserInputDto = z.object({
    login: z.string().min(1),
    password: z.string().min(1)
})

export type PostUserInputDto = ReturnType<typeof PostUserInputDto.parse>