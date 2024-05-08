import { SetMetadata } from '@nestjs/common';

import { AuthMetadata } from '../constants/auth.constant';

export const Public = () => SetMetadata(AuthMetadata.PUBLIC, true);
