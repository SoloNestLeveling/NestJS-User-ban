import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";
import { AuthService } from "src/auth/auth.service";
import { JWT_SECRET_KEY } from "src/common/const/env.const";
import { UsersService } from "../users.service";
import { BanService } from "../ban.service";

@Injectable()
export class LogBanMeddleware implements NestMiddleware {
    constructor(

        private readonly authService: AuthService,

        private readonly banService: BanService,
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {

        const token = req.headers.authorization?.split(' ')[1];

        if (token) {


            try {


                const userEmailAndPassword = this.authService.decodedToken(token)

                const user = await this.banService.getbanUser(userEmailAndPassword.email)


                if (user) {

                    return res.status(400).json({ message: `사용이 정지된 계정입니다. 정지 관련 문의는 고객센터로 부탁드립니다!` })

                }

            } catch (e) {

                console.error('Invalid User')

                return res.status(404).json({ message: '인증되지 않은 사용자입니다. 토큰을 확인해주세요' })
            }

            next();

        };







    }
}