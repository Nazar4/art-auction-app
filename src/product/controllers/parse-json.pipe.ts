import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ParseJSONPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    try {
      return JSON.parse(value['createProductDTO']);
    } catch (error) {
      throw new BadRequestException('Invalid JSON payload');
    }
  }
}
