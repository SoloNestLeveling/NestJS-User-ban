import { ExecutionContext, UnauthorizedException, createParamDecorator } from "@nestjs/common";

export const User = createParamDecorator((data, context: ExecutionContext) => {

    const req = context.switchToHttp().getRequest()

    if (!req.user) {
        throw new UnauthorizedException('반드시 accessToken과 함께 사용해야합니다.')
    };

    return req.user;
})