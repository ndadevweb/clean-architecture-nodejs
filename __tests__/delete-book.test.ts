import 'reflect-metadata'
import { randomUUID } from "node:crypto"
import { container } from "tsyringe"
import DeleteBook from "../src/core/use-cases/delete-book.use-case"
import { BookRepository } from "../src/core/ports/database.port"
import Logger from "../src/core/ports/logger.port"

describe("DeleteBook", () => {
    const id: string = randomUUID()

    const mock__delete = jest.fn()
    const mock__BookRepository = () => {
        return {
            delete: mock__delete
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

    test("It should delete the book with id", async () => {
        mock__delete.mockResolvedValue(true)

        const response = await new DeleteBook().execute(id)

        expect(response).toBeUndefined()
        expect(container.resolve<BookRepository>('BookRepository').delete).toHaveBeenCalledWith(id)
    })

    test("It should return not found with wrong id", async () => {
        mock__delete.mockResolvedValue(false)

        const response = await new DeleteBook().execute(id)

        expect(response).toStrictEqual('BOOK_NOT_FOUND')
    })
})