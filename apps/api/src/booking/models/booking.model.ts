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
import dayjs from 'dayjs';

import { DATE_FORMAT } from '../../common/common.constant';

@Table({
  tableName: 'bookings',
  modelName: 'Booking',
  timestamps: true,
  paranoid: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
})
export class Booking extends Model<Booking> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  public id: string;

  @Column
  public name: string;

  @Column
  public email: string;

  @Column
  public phone: string;

  @Column({
    type: DataType.UUID,
  })
  public country_id: string;

  @Column
  public surfing_experience: number;

  @Column({
    type: DataType.DATEONLY,
    get(this: Booking) {
      return dayjs(this.getDataValue('date')).format(DATE_FORMAT);
    },
  })
  date: string;

  @Column({
    type: DataType.UUID,
  })
  public surfboard_id: string;

  @Unique
  @Column({
    type: DataType.TEXT,
  })
  public national_id_photo_file_key: string;

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
