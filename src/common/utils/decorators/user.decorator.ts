/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtUserPayload } from 'src/common/types/jwt-user-payload.type';

export const User = createParamDecorator(
  (data: keyof JwtUserPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    return data ? (user as JwtUserPayload)?.[data] : (user as JwtUserPayload);
  },
);