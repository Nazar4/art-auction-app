import { SetMetadata } from '@nestjs/common';

export const FieldName = (fieldName: string) =>
  SetMetadata('fieldName', fieldName);
