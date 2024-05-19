import { ApiProperty } from '@nestjs/swagger';

export class AuthTokenDataDto {
  @ApiProperty()
  access_token: string;
}
