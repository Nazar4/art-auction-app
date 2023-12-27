import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform
} from '@nestjs/common';

@Injectable()
export class ParsePositiveIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const intValue = parseInt(value, 10);

    if (isNaN(intValue) || intValue <= 0) {
      throw new BadRequestException(
        `Invalid value for parameter ${metadata.data}`
      );
    }

    return intValue;
  }
}
