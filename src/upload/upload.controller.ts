import { Controller, Get, Param } from '@nestjs/common';
import { UploadService } from './upload.service';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Upload')
@ApiBearerAuth('Authorization')
@Controller('upload')
export class UploadController {
  constructor(private readonly configService: ConfigService) {}
  @Get()
  async getURL() {
    const s3 = new S3({
      signatureVersion: 'v4',
      region: this.configService.get('AWS_BUCKET_REGION'),
    });
    s3.config.credentials = {
      accessKeyId: this.configService.get('AWS_ACCESS_KEY'),
      secretAccessKey: this.configService.get('AWS_SECRET_KEY'),
    };
    const signedUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: this.configService.get('AWS_BUCKET_NAME'),
      Key: 'iqc/' + Date.now(),
      Expires: 300,
    });

    return {
      signedUrl,
    };
  }
}
