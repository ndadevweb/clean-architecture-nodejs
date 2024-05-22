import { Book } from "../book.interface";

export type CreateBookInput = {
    title: string,
    summary: string,
    author: string,
    totalPages: number
}

export interface BookRepository {
    create(args: CreateBookInput): Promise<Book>

    findById(id: string): Promise<Book | null>

    list(): Promise<Book[]>

    delete(id: string): Promise<boolean>
    
    
}