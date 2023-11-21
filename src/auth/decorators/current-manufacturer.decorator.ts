import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentManufacturer = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.manufacturer ?? null;
  },
);
