import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

import { PasswordSaltRound } from '../auth.constant';

@Table({
  tableName: 'user_passwords',
  modelName: 'UserPassword',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class UserPassword extends Model<UserPassword> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  public id: string;

  @Column({
    type: DataType.UUID,
  })
  public user_id: string;

  @Column({
    type: DataType.TEXT,
  })
  public hash: string;

  @CreatedAt
  @Column
  public created_at: Date;

  @UpdatedAt
  @Column
  public updated_at: Date;

  @AllowNull
  @DeletedAt
  @Column
  public deleted_at: Date | null;

  @BeforeCreate
  @BeforeUpdate
  public static async hashPassword(userPassword: UserPassword) {
    userPassword.hash = await bcrypt.hash(
      userPassword.hash,
      PasswordSaltRound.Default,
    );
  }
}
