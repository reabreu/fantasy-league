import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialUsers1567189651689 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `INSERT INTO "user" (name, email, type) VALUES ('Ruben', 'emanuelfreitas477@gmail.com', 'admin')`
    );
  }

  async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DELETE FROM user WHERE email = 'emanuelfreitas477@gmail.com'`
    );
  }
}
