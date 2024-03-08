import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersModel } from "../entity/users.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JWT_SECRET_KEY } from "src/common/const/env.const";
import { UsersService } from "../users.service";

@Injectable()
export class BanMeddleware implements NestMiddleware {

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly usersService: UsersService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {

        const token = req.headers.authorization?.split(' ')[1];

        if (token) {

            try {
                const user = this.jwtService.verify(token, {
                    secret: this.configService.get<string>(JWT_SECRET_KEY)
                });

                const userEmail = user.email

                const banUser = await this.usersService.getUserByEmail(userEmail)

                if (banUser && banUser.isBanned && (!banUser.banExpiration || banUser.banExpiration > new Date())) {
                    // 벤 상태인 경우 에러를 발생시킴
                    return res.status(400).json({ message: `현재 계정은 ${(banUser.banExpiration).toLocaleString('kr')}까지 정지 상태입니다.` });
                }




            } catch (e) {
                console.error('Invalid token');
                return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
            }
        }

        next()

    }
}