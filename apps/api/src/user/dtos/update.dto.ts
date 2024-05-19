import { PickType, OmitType } from '@nestjs/swagger';

import { CreateUserBodyDto } from './create.dto';

export class UpdateUserEmailBodyDto extends PickType(CreateUserBodyDto, [
  'email',
] as const) {}

export class UpdateUserBodyDto extends OmitType(CreateUserBodyDto, [
  'email',
] as const) {}
