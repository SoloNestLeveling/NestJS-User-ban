import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../decorator/role.decorator";
import { RolesEnumType } from "../entity/users.entity";
import { TreeRepositoryUtils } from "typeorm";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private readonly reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const requiredAuth = await this.reflector.getAllAndOverride(
            ROLES_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        );


        if (!requiredAuth) {
            return true;
        }


        const { user } = context.switchToHttp().getRequest()


        if (!user) {
            throw new UnauthorizedException('반드시 accessToken과 함께 사용 해야합니다.')
        }



        if (user.role !== RolesEnumType.ADMIN) {
            throw new ForbiddenException('작업을 수행할 권한이 없습니다.')
        };

        return true;

    }
}