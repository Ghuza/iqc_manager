import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from 'src/util/types/roles.enum';

export class portalAdminMigration1675088165227 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // migrate user scheam
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "first_name" character varying(64) NOT NULL, "last_name" character varying(64) NOT NULL, "email" character varying(320) NOT NULL, "password" character varying(64) NOT NULL, "status" character varying NOT NULL DEFAULT 'ACTIVE', "role" character varying NOT NULL DEFAULT 'USER', "company_id" uuid, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))
`);

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
