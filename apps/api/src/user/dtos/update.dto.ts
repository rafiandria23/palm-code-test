import { PickType, OmitType } from '@nestjs/mapped-types';

import { CreateUserBodyDto } from './create.dto';

export class UpdateUserEmailBodyDto extends PickType(CreateUserBodyDto, [
  'email',
]) {}

export class UpdateUserBodyDto extends OmitType(CreateUserBodyDto, ['email']) {}
