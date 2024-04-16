import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BanModel } from "./entity/ban.entity";
import { CreateBanDto } from "./dto/create-ban.dto";
import { Repository } from "typeorm";
import { UsersModel } from "../entity/users.entity";
import { UsersService } from "../users.service";
import { userInfo } from "os";
import { UnbanUserDto } from "./dto/unban-user.dto";
import { RolesEnumType } from "../enum/roles.enum";

@Injectable()
export class BanService {
    constructor(
        @InjectRepository(BanModel)
        private readonly banRepository: Repository<BanModel>,
        @InjectRepository(UsersModel)
        private readonly usersRepository: Repository<UsersModel>,
        private readonly usersService: UsersService
    ) { }


    async createBan(dto: CreateBanDto, managerId: number) {

        const manager = await this.usersService.getManager(managerId)

        if (manager) {

            const banForm = this.banRepository.create({
                user: {
                    id: manager.id
                },
                banUserId: dto.banUserId,
                reason: dto.reason

            });

            const result = await this.banRepository.save(banForm);

            return result;

        } else {
            throw new BadRequestException("매니저가 존재 하지 않습니다.")
        }
    };




    // async BanAllow(userId:number){

    //     const banForm = await this.banRepository.findOne({
    //         where:{
    //             id:userId
    //         }
    //     });


    //     banForm.isPermission =true;

    //     await this.banRepository.save(banForm);

    //     return true;


    // }


    async banUser(banUserId: number, managerId: number, banDurationDays: number): Promise<boolean> {

        const user = await this.usersService.getUserById(banUserId)

        const manager = await this.usersService.getManager(managerId)



        if (user) {

            const banExpiration = new Date();
            banExpiration.setDate(banExpiration.getDate() + banDurationDays);



            user.isBanned = true;
            user.banExpiration = banExpiration;
            user.role = RolesEnumType.BAN;
            user.banCount += 1;
            await this.usersRepository.save(user)


            const userObj = {

                email: user.email,
                nickname: user.nickname,
                banExpiration: user.banExpiration
            };


            manager.banList.push(userObj)
            await this.usersRepository.save(manager)
        }


        return true;

    };


    async unbanUser(dto: UnbanUserDto, managerId: number): Promise<boolean> {

        const manager = await this.usersService.getManager(managerId)


        if (manager) {

            const banUser = manager.banList.find((a) => a.nickname === dto.nickname);


            if (banUser) {
                const user = await this.usersService.getUserByEmail(banUser.email);


                user.banExpiration = null;
                user.isBanned = false;
                user.role = RolesEnumType.USER;
                await this.usersRepository.save(user);


                const newList = manager.banList.filter((a) => a.nickname !== user.nickname);
                manager.banList = newList

                await this.usersRepository.save(manager);

            } else {
                throw new BadRequestException('정지된 유저가 아닙니다.');
            };

        } else {

            throw new BadRequestException('존재 하지 않는 매니저입니다.')
        };

        return true;

    }





    async getbanUser(email: string) {

        const bannedUser = await this.usersRepository.findOne({
            where: {
                email,
                isBanned: true
            }
        });



        return bannedUser;
    }

}