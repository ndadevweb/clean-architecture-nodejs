import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class Book {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column()
    summary: string;

    @Column()
    author: string;

    @Column()
    totalPages: number;

    @Column({
        type: 'timestamp without time zone',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP'
    })
    createdAt: Date;
}

export default Book