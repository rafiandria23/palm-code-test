import { PickType, OmitType } from '@nestjs/mapped-types';

import { CreateUserDto } from './create.dto';

export class UpdateUserEmailDto extends PickType(CreateUserDto, ['email']) {}

export class UpdateUserDto extends OmitType(CreateUserDto, ['email']) {}
