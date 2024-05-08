import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class AppService {
  public successTimestamp({ success = true, data = undefined } = {}) {
    if (data || data === null) {
      return {
        success,
        timestamp: dayjs(),
        data,
      };
    }

    return {
      success,
      timestamp: dayjs(),
    };
  }
}
