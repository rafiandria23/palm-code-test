import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class AppService {
  public successTimestamp({
    success = true,
    metadata = undefined,
    data = undefined,
  } = {}) {
    return {
      success,
      timestamp: dayjs(),
      metadata,
      data,
    };
  }
}
