import { container } from "tsyringe";

import Logger from "../../core/ports/logger.port";
import LoggerConfig from "./winston-logger/winston-logger.config";
import { WinstonLogger, logLevel } from "./winston-logger/winston-logger.adapter";
import { BookRepository } from "../../core/ports/database.port";
import TypeOrmBookRepository from "./type-orm/book/book.repository"

container.register<Logger>('Logger', {
    useValue: new WinstonLogger(LoggerConfig.logLevel as logLevel)
})
.register<BookRepository>('BookRepository', {
    useValue: new TypeOrmBookRepository()
})