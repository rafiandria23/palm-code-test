import { UUIDV4 } from 'sequelize';
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

import { PasswordSaltRounds } from '../constants';

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
    defaultValue: UUIDV4,
  })
  public id: string;

  @Column({
    type: DataType.UUID,
  })
  public user_id: string;

  @Column({
    type: DataType.TEXT,
  })
  public password: string;

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
  public static async hashPassword(this: UserPassword) {
    this.password = await bcrypt.hash(this.password, PasswordSaltRounds);
  }
}
