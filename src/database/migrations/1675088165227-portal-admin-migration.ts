import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/util/types/roles.enum';

export class portalAdminMigration1675088165227 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const { PORTAL_ADMIN_EMAIL: email, PORTAL_ADMIN_PASSWORD: password } =
      process.env;
    const hashedPassword = await bcrypt.hash(password, 12);

    await queryRunner.query(`
    INSERT INTO "user" ( email, password, first_name, last_name, role)
    VALUES ('${email}','${hashedPassword}','John', 'Doe', '${Roles.PORTAL_ADMIN}')
`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM "user" WHERE email = '${process.env.PORTAL_ADMIN_EMAIL}'
`);
  }
}
