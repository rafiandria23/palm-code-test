import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

import { SuccessTimestampDto } from './common.dto';

@Injectable()
export class CommonService {
  public successTimestamp<MD = undefined, D = undefined>(
    payload?: Partial<SuccessTimestampDto<MD, D>> | undefined,
  ): SuccessTimestampDto<MD, D> {
    return {
      success: _.get(payload, 'success', true),
      timestamp: _.get(payload, 'timestamp', dayjs()),
      metadata: _.get(payload, 'metadata'),
      data: _.get(payload, 'data'),
    };
  }
}
