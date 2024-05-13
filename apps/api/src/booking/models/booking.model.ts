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
  Unique,
} from 'sequelize-typescript';
import dayjs from 'dayjs';

import { DATE_FORMAT } from '../../common/constants/date.constant';

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
    defaultValue: UUIDV4,
  })
  public id: string;

  @Column
  public visitor_name: string;

  @Column
  public visitor_email: string;

  @Column
  public visitor_phone: string;

  @Column({
    type: DataType.UUID,
  })
  public visitor_country_id: string;

  @Column
  public surfing_experience: number;

  @Column({
    type: DataType.DATEONLY,
    get(this: Booking) {
      return dayjs(this.getDataValue('visit_date')).format(DATE_FORMAT);
    },
  })
  visit_date: string;

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
