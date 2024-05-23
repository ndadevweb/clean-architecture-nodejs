import 'reflect-metadata'
import { randomUUID } from "node:crypto"
import { container } from "tsyringe"
import { Book } from "../src/core/book.interface"
import GetBook from "../src/core/use-cases/get-book.use-case"
import { BookRepository } from "../src/core/ports/database.port"
import Logger from "../src/core/ports/logger.port"

describe("GetBook", () => {
    const id: string = randomUUID()
    const mock__data: Book = {
        id: id,
        title: "First title",
        author: "First author",
        summary: "First summary",
        totalPages: 200
    }

    const mock__findById = jest.fn()
    const mock__BookRepository = () => {
        return {
            findById: mock__findById
        }
    }

    container.register<Partial<BookRepository>>('BookRepository', {
        useValue: mock__BookRepository()
    })

    container.register<Partial<Logger>>('Logger', {
        useValue: {
            debug: jest.fn()
        }
    })

    test("It should return the book with id", async () => {
        mock__findById.mockResolvedValue(mock__data)

        const response = await new GetBook().execute(id)

        expect(response).toStrictEqual(mock__data)
        expect(container.resolve<BookRepository>('BookRepository').findById).toHaveBeenCalledWith(id)
    })

    test("It should return not found with wrong id", async () => {
        mock__findById.mockResolvedValue(null)

        const response = await new GetBook().execute(id)

        expect(response).toStrictEqual('BOOK_NOT_FOUND')
    })
})