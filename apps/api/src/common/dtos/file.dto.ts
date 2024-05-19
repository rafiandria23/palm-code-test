import { ApiProperty } from '@nestjs/swagger';

export class UploadFileDataDto {
  @ApiProperty()
  public readonly file_key: string;
}
