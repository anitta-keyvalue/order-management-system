import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderTable1749371063809 implements MigrationInterface {
    name = 'UpdateOrderTable1749371063809'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" ADD "status" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`);
    }

}
