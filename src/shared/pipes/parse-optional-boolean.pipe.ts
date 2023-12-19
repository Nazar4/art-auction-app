import { ArgumentMetadata, Injectable, ParseBoolPipe } from '@nestjs/common';

@Injectable()
export class ParseOptionalBoolPipe extends ParseBoolPipe {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value === undefined) {
      return false;
    }

    return super.transform(value, metadata);
  }
}
