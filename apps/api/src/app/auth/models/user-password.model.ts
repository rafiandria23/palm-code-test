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
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  BeforeUpdate,
} from 'sequelize-typescript';
import bcrypt from 'bcrypt';

import { User } from '../../user/models/user.model';

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

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    onDelete: 'CASCADE',
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

  @BelongsTo(() => User, 'user_id')
  public user: User;

  @BeforeCreate
  @BeforeUpdate
  public static async hashPassword(userPassword: UserPassword) {
    userPassword.password = await bcrypt.hash(userPassword.password, 10);
  }
}
