import { Controller, Route, Get, Post, Delete, SuccessResponse, Path, Body, Tags } from "tsoa"
import { GetBookOutputDto, GetBooksOutputDto, PostBookInputDto } from "./dto"
import { createBookCodec, getBookCodec } from "./book.codec"

@Route('books')
@Tags('Books')
export class BookController extends Controller {
    constructor() {
        super()
    }

    @Get()
    @SuccessResponse(200)
    async list(): Promise<GetBooksOutputDto> {
        return []
    }

    @Get('{id}')
    @SuccessResponse(200)
    async getById(@Path() id: string): Promise<GetBookOutputDto> {
        const bookId = getBookCodec.decodeBookId(id)

        if(!bookId.success) {
            throw 'Invalid book id format'
        }
        return {
            id: 'mock id',
            author: 'mock author',
            summary: 'mock summary',
            title: 'mock title',
            totalPages: 100
        }
    }

    @Post()
    @SuccessResponse(201)
    async create(
        @Body() requestBody: PostBookInputDto
    ): Promise<PostBookInputDto> {
        const decodingResult = createBookCodec.decode(requestBody)

        if(!decodingResult.success) {
            throw decodingResult.error.toString()
        }
        return {
            author: 'mock author',
            summary: 'mock summary',
            title: 'mock title',
            totalPages: 100
        }
    }

    @Delete('{id}')
    @SuccessResponse(204)
    async delete(@Path() id: string): Promise<void> {
        const bookId = getBookCodec.decodeBookId(id)

        if(!bookId.success) {
            throw 'Invalid book id format'
        }
        // return
    }
}
