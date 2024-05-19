import { ApiProperty } from '@nestjs/swagger';
import { MultipartFile } from '@fastify/multipart';

export class UploadNationalIdPhotoBodyDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  national_id_photo: MultipartFile;
}
