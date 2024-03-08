import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "src/users/users.service";
import { AuthService } from "../auth.service";
import { Reflector } from "@nestjs/core";
import { PUBLIC_KEY } from "src/common/decorator/public.decorator";

@Injectable()
export class BearerTokenGuard implements CanActivate {

    constructor(
        private readonly userService: UsersService,
        private readonly authService: AuthService,
        private readonly reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {


        const isPublic = await this.reflector.getAllAndOverride(
            PUBLIC_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]

        );



        const req = context.switchToHttp().getRequest()

        if (isPublic) {
            req.isPublic = true;

            return true;
        }

        const rawToken = req.headers['authorization'];

        if (!rawToken) {
            throw new UnauthorizedException('토크이 존재하지 않습니다.')
        };

        const token = this.authService.extractTokenFromHeader(rawToken, true);
        const result = await this.authService.verifyToken(token);
        const user = await this.userService.getUserByEmail(result.email);

        req.user = user;
        req.token = token;
        req.tokenType = result.type;

        return true;

    };
};



@Injectable()
export class AccessTokenGuared extends BearerTokenGuard {

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await super.canActivate(context);

        const req = context.switchToHttp().getRequest();

        if (req.isPublic) {
            return true;
        }

        if (req.tokenType !== 'access') {
            throw new UnauthorizedException('acceeToken이 아닙니다.')
        };

        return true;

    }
}