import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { UsersModel } from 'src/users/entity/users.entity';
import { HASH_ROUND_KEY, JWT_SECRET_KEY } from 'src/common/const/env.const';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ) { }



    signToken(user: Pick<UsersModel, 'email' | 'id'>, isRefresh: boolean) {

        const payload = {
            email: user.email,
            sub: user.id,
            type: isRefresh ? 'refresh' : 'access'
        };

        return this.jwtService.sign(payload, {
            secret: this.configService.get<string>(JWT_SECRET_KEY),
            expiresIn: isRefresh ? 3600 : 300
        });
    };


    returnToken(user: Pick<UsersModel, 'email' | 'id'>) {

        return {
            accessToken: this.signToken(user, false),
            refreshToken: this.signToken(user, true)
        }
    };


    async registerWithEmail(dto: CreateUserDto) {

        const hash = await bcrypt.hash(
            dto.password,
            parseInt(this.configService.get<string>(HASH_ROUND_KEY))
        );

        const result = await this.usersService.createUser({
            ...dto,
            password: hash
        });

        return this.returnToken(result)
    };


    async authenticatedWithEmailAndPassword(user: Pick<UsersModel, 'email' | 'password'>) {

        const existEmail = await this.usersService.getUserByEmail(user.email);

        if (!existEmail) {
            throw new BadRequestException('존재 하지 않는 이메일입니다.')
        };

        const passOk = bcrypt.compare(user.password, existEmail.password);

        if (!passOk) {
            throw new BadRequestException('패스워드가 틀렸습니다.')
        };


        return existEmail;
    };


    async loginWithEmail(user: Pick<UsersModel, 'email' | 'password'>) {
        const verifiedUser = await this.authenticatedWithEmailAndPassword(user);

        return this.returnToken(verifiedUser)
    };



    extractTokenFromHeader(header: string, isBearer: boolean) {

        const split = header.split(' ');
        const prefix = isBearer ? 'Bearer' : 'Basic';

        if (split.length !== 2 || split[0] !== prefix) {
            throw new UnauthorizedException('잘못된 토큰 값입니다.')
        };

        const token = split[1];

        return token;
    };



    decodedToken(base64String: string) {

        const decode = Buffer.from(base64String, 'base64').toString('utf-8');

        const split = decode.split(':');
        if (split.length !== 2) {
            throw new UnauthorizedException('잘못된 토큰 값입니다.')
        };

        const email = split[0];
        const password = split[1];

        return {
            email,
            password,
        };
    };


    loginUser(rawToken: string) {

        const token = this.extractTokenFromHeader(rawToken, false);
        const result = this.decodedToken(token);

        return this.loginWithEmail(result);
    };


    // Re-Create Token

    async verifyToken(token: string) {

        try {
            const payload = await this.jwtService.verify(token, {
                secret: this.configService.get<string>(JWT_SECRET_KEY)
            });

            return payload;

        } catch (e) {

            throw new UnauthorizedException('토큰이 만료 되었거나, 잘못된 토큰입니다.')

        };
    };

    async rotateToken(token: string, isRefresh: boolean) {

        const verifiedToken = await this.verifyToken(token);

        if (verifiedToken.type !== 'refresh') {
            throw new UnauthorizedException('토큰 재발급은 refreshToken으로만 가능합니다.')
        }

        return this.signToken({
            ...verifiedToken
        }, isRefresh)
    };



    async createAccessToken(rawToken: string) {
        const token = this.extractTokenFromHeader(rawToken, true);

        const newToken = await this.rotateToken(token, false);

        return {
            accessToken: newToken
        }
    };


    async createRefreshToken(rawToken: string) {
        const token = this.extractTokenFromHeader(rawToken, true);

        const newToken = await this.rotateToken(token, true);

        return {
            refreshToken: newToken
        }
    };



}
