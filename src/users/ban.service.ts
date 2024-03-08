import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BanModel } from "./entity/ban.entity";
import { privateDecrypt } from "crypto";
import { CreateBanDto } from "./dto/create-ban.dto";
import { Repository } from "typeorm";
import { UsersModel } from "./entity/users.entity";
import { UsersService } from "./users.service";

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

        const { bannedUserId, reason } = dto;

        const banForm = this.banRepository.create({
            user: {
                id: managerId
            },
            bannedUserId,
            reason,
        });

        const result = await this.banRepository.save(banForm);



        return result;
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


    async banUser(bannedUserId: number, managerId: number, banDurationDays: number): Promise<void> {

        const user = await this.usersRepository.findOne({
            where: {
                id: bannedUserId
            }
        });


        const manager = await this.usersService.getManager(managerId)



        if (user) {

            const banExpiration = new Date();
            console.log(banExpiration)

            banExpiration.setDate(banExpiration.getDate() + banDurationDays);

            console.log(banExpiration)

            user.isBanned = true;
            user.banExpiration = banExpiration;



            await this.usersRepository.save(user)

            manager.banList.push(user)
            await this.usersRepository.save(manager)
        }


    };


    async unBanUser(userId: number) {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId
            }
        });

        if (user) {

            user.isBanned = false;
            user.banExpiration = null

            await this.usersRepository.save(user)
        }

    }



    async increaseBanCount(userId: number) {

        const increase = await this.usersRepository.increment({

            id: userId
        }, 'banCount', 1);

        return increase;
    };




    async decreaseBanCount(userId: number) {

        const decrease = await this.usersRepository.decrement({

            id: userId
        }, 'banCount', 1);

        return decrease;
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