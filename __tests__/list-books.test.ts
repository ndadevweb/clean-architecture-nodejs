import 'reflect-metadata'
import { randomUUID } from "node:crypto"
import { container } from "tsyringe"
import { Book } from "../src/core/book.interface"
import ListBooks from "../src/core/use-cases/list-books.use-cases"
import { BookRepository } from "../src/core/ports/database.port"
import Logger from "../src/core/ports/logger.port"

describe("ListBooks", () => {
    const mock__data: Book[] = [{
        id: randomUUID(),
        title: "First title",
        author: "First author",
        summary: "First summary",
        totalPages: 200
    },
    {
        id: randomUUID(),
        title: "Second title",
        author: "Second author",
        summary: "Second summary",
        totalPages: 400
    }]

    const mock__list = jest.fn()
    const mock__BookRepository = () => {
        return {
            list: mock__list
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

    test("It should return the books list", async () => {
        mock__list.mockResolvedValue(mock__data)

        const response = await new ListBooks().execute()

        expect(response).toStrictEqual(mock__data)
        expect(container.resolve<BookRepository>('BookRepository').list).toHaveBeenCalled()
    })
})