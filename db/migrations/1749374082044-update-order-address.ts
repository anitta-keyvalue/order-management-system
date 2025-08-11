import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateOrderAddress1749374082044 implements MigrationInterface {
    name = 'UpdateOrderAddress1749374082044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae" FOREIGN KEY ("order_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae"`);
        await queryRunner.query(`ALTER TABLE "order" ADD CONSTRAINT "FK_4e9546e160d94997ebf123aa0ae" FOREIGN KEY ("order_address_id") REFERENCES "order_address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
