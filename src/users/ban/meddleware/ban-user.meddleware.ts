import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { UsersModel } from "../../entity/users.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JWT_SECRET_KEY } from "src/common/const/env.const";
import { UsersService } from "../../users.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Socket } from "dgram";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UserBanMeddleware implements NestMiddleware {

    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        private readonly authService: AuthService,
        private readonly usersService: UsersService
    ) { }
    async use(req: Request, res: Response, next: NextFunction) {

        const headers = req.headers

        const rawToken = headers['authorization'];



        if (rawToken) {

            try {

                const token = this.authService.extractTokenFromHeader(rawToken, false);
                const userEmailAndPw = this.authService.decodedToken(token);
                const result = await this.authService.authenticatedWithEmailAndPassword(userEmailAndPw)


                const user = await this.usersService.getUserByEmail(result.email)

                if (user && user.isBanned && user.banExpiration < new Date()) {

                    user.isBanned = false;
                    user.banExpiration = null;
                    await this.usersRepository.save(user);

                    next()

                };


                if (user && user.isBanned && user.banExpiration > new Date()) {

                    return res.status(404).json({ message: `현재 계정은 ${user.banExpiration.toLocaleString('kr')}까지 정지 상태입니다.` })
                }




            } catch (e) {
                console.error('Invalid token');
                return res.status(401).json({ message: '인증되지 않은 사용자입니다.' });
            }
        }

        next()

    }
}