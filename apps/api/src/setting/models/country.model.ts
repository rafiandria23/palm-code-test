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
} from 'sequelize-typescript';

@Table({
  tableName: 'countries',
  modelName: 'Country',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class Country extends Model<Country> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  })
  public id: string;

  @Column
  public name: string;

  @Column
  public code: string;

  @Column
  public dial_code: string;

  @Column
  public unicode: string;

  @Column
  public emoji: string;

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
