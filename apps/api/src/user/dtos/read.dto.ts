import { IntersectionType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto, PaginationSortDto } from '../../common';

export class ReadAllDto extends IntersectionType(
  PaginationDto,
  PaginationSortDto,
) {
  @ApiProperty()
  sort_by: string;
}
