import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  ValidationPipe
} from '@nestjs/common';

@Injectable()
export class ParseJSONPipe implements PipeTransform {
  private readonly fieldName: string;
  private readonly validationPipe?: ValidationPipe;

  constructor(fieldName: string) {
    this.fieldName = fieldName;
    this.validationPipe = new ValidationPipe();
  }

  transform(value: any, metadata: ArgumentMetadata) {
    try {
      const parsedJSON = JSON.parse(value[this.fieldName]);
      return this.validationPipe.transform(parsedJSON, metadata);
      // return parsedJSON;
    } catch (error) {
      throw new BadRequestException('Invalid JSON payload');
    }
  }
}
