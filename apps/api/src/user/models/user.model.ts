import {
  Table,
  Model,
  Column,
  DataType,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
  Unique,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  modelName: 'User',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class User extends Model<User> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  public id: string;

  @Column
  public first_name: string;

  @AllowNull
  @Column
  public last_name: string | null;

  @Unique
  @Column
  public email: string;

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
}
