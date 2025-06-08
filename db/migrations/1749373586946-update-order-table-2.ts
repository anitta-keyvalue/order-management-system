import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderTable21749373586946 implements MigrationInterface {
    name = 'UpdateOrderTable21749373586946'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "total_price" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_price"`);
    }

}
