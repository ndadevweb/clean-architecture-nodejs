import { container } from "tsyringe";
import { Book } from "../book.interface";
import Logger from "../ports/logger.port";
import { BookRepository } from "../ports/database.port";

class ListBooks {
    private logger: Logger
    private bookRepository: BookRepository

    constructor() {
        this.logger = container.resolve<Logger>('Logger')
        this.bookRepository = container.resolve<BookRepository>('BookRepository')
    }

    async execute(): Promise<Book[]> {
        this.logger.debug('[List-books use-case] Start')

        return this.bookRepository.list()
    }
}

export default ListBooks