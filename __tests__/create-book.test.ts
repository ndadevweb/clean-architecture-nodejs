import 'reflect-metadata'
import { randomUUID } from "node:crypto"
import { container } from "tsyringe"
import { Book } from "../src/core/book.interface"
import CreateBook from "../src/core/use-cases/create-book.use-case"
import { BookRepository } from "../src/core/ports/database.port"
import Logger from "../src/core/ports/logger.port"

describe("CreateBook", () => {
    const mock__data: Book = {
        id: randomUUID(),
        title: "First title",
        author: "First author",
        summary: "First summary",
        totalPages: 200
    }

    const mock__create = jest.fn()
    const mock__BookRepository = () => {
        return {
            create: mock__create
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

    test("It should create the book", async () => {
        const body = {
            title: "First title",
            author: "First author",
            summary: "First summary",
            totalPages: 200
        }
        mock__create.mockResolvedValue(mock__data)

        const response = await new CreateBook().execute(body)

        expect(response).toStrictEqual(mock__data)
        expect(container.resolve<BookRepository>('BookRepository').create).toHaveBeenCalled()
    })
})