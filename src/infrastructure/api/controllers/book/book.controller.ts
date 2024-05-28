import { Controller, Route, Get, Post, Delete, SuccessResponse, Path, Body, Tags, Security, Response } from "tsoa"
import { GetBookOutputDto, GetBooksOutputDto, PostBookInputDto } from "./dto"
import CreateBookUseCase from '../../../../core/use-cases/create-book.use-case'
import DeleteBookUseCase from '../../../../core/use-cases/delete-book.use-case'
import GetBookUseCase from '../../../../core/use-cases/get-book.use-case'
import ListBooksUseCase from '../../../../core/use-cases/list-books.use-cases'
import { createBookCodec, getBookCodec } from "./book.codec"
import { InvalidInputError, NotFoundError } from "../../errro-handler"

@Route('books')
@Tags('Books')
@Security('jwt')
export class BookController extends Controller {
    constructor() {
        super()
    }

    @Get()
    @SuccessResponse(200)
    async list(): Promise<GetBooksOutputDto> {
        return await new ListBooksUseCase().execute()
    }

    @Get('{id}')
    @SuccessResponse(200)
    @Response(400, 'Invalid request params')
    @Response(404, 'Not Found')
    async getById(@Path() id: string): Promise<GetBookOutputDto> {
        const bookId = getBookCodec.decodeBookId(id)

        if(!bookId.success) {
            throw new InvalidInputError('Invalid book id format')
        }
        
        const book = await new GetBookUseCase().execute(bookId.data)

        if(book === 'BOOK_NOT_FOUND') {
            throw new NotFoundError('BOOK_NOT_FOUND')
        }

        return book
    }

    @Post()
    @SuccessResponse(201)
    @Response(400, 'Invalid request params')
    async create(
        @Body() requestBody: PostBookInputDto
    ): Promise<PostBookInputDto> {
        const decodingResult = createBookCodec.decode(requestBody)

        if(!decodingResult.success) {
            throw new InvalidInputError(decodingResult.error.toString())
        }
        
        return await new CreateBookUseCase().execute(decodingResult.data)
    }

    @Delete('{id}')
    @SuccessResponse(204)
    @Response(400, 'Invalid book id format')
    @Response(404, 'Not Found')
    async delete(@Path() id: string): Promise<void> {
        const bookId = getBookCodec.decodeBookId(id)

        if(!bookId.success) {
            throw new InvalidInputError('Invalid book id format')
        }
        
        const result = await new DeleteBookUseCase().execute(bookId.data)

        if(result === 'BOOK_NOT_FOUND') {
            throw new NotFoundError('BOOK_NOT_FOUND')
        }
    }
}
