import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrder31749375048944 implements MigrationInterface {
    name = 'UpdateOrder31749375048944'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae"`);
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "REL_4e9546e160d94997ebf123aa0a"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae" FOREIGN KEY ("order_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "REL_4e9546e160d94997ebf123aa0a" UNIQUE ("order_address_id")`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae" FOREIGN KEY ("order_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
