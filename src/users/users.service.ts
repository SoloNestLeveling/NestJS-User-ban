import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersModel } from './entity/users.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { RolesEnumType } from './enum/roles.enum';

@Injectable()
export class UsersService {

    constructor(
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>
    ) { }


    async createUser(dto: CreateUserDto) {

        const { email, password, nickname } = dto;

        const existEmail = await this.usersRepository.exists({
            where: {
                email,
            }
        });

        if (existEmail) {
            throw new BadRequestException('이미 존재하는 이메일입니다.')
        }


        const existNickName = await this.usersRepository.exists({
            where: {
                nickname,
            }
        });

        if (existNickName) {
            throw new BadRequestException('이미 존재하는 닉네임입니다.')
        }

        const user = this.usersRepository.create({
            email,
            password,
            nickname,
        });

        const result = await this.usersRepository.save(user);

        return result;
    };


    async getUserByEmail(email: string) {

        const user = await this.usersRepository.findOne({
            where: {
                email,
            }
        });

        return user;
    };



    async getUserById(id: number) {

        const user = await this.usersRepository.findOne({
            where: {
                id,
            }
        });

        return user;
    }


    async getManager(id: number) {
        const manager = await this.usersRepository.findOne({
            where: {
                id,
                role: RolesEnumType.ADMIN
            },
            relations: ['banForms']
        });

        return manager


    }


    async getAllUsers() {
        const user = await this.usersRepository.find()

        return user;
    };



}
