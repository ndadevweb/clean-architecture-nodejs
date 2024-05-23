import { container } from "tsyringe";
import { Book } from "../book.interface";
import { BookRepository } from "../ports/database.port";
import Logger from "../ports/logger.port";

class GetBook {

    private logger: Logger
    private bookRepository: BookRepository

    constructor() {
        this.logger = container.resolve<Logger>('Logger')
        this.bookRepository = container.resolve<BookRepository>('BookRepository')
    }

    async execute(id: string): Promise<Book | 'BOOK_NOT_FOUND'> {
        this.logger.debug('[Get-book usecase] Start')

        const data = await this.bookRepository.findById(id)

        return data ?? 'BOOK_NOT_FOUND'
    }
}

export default GetBook