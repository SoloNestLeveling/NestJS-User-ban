import { Body, Controller, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { BanService } from "./ban.service";
import { CreateBanDto } from "./dto/create-ban.dto";
import { User } from "../decorator/user.decorator";
import { UsersModel } from "../entity/users.entity";
import { Roles } from "../decorator/role.decorator";
import { RolesEnumType } from "../enum/roles.enum";
import { UnbanUserDto } from "./dto/unban-user.dto";

@Controller('ban')
export class BanController {
    constructor(
        private readonly banService: BanService
    ) { }


    @Post(':managerId')
    createBan(
        @Body() dto: CreateBanDto,
        @Param('managerId', ParseIntPipe) managerId: number
    ) {

        return this.banService.createBan(dto, managerId);
    }

    @Post('user/:banUserId')
    @Roles(RolesEnumType.ADMIN)
    userBan(
        @User() manager: UsersModel,
        @Param('banUserId', ParseIntPipe) banUserId: number,
        @Body('banDurationDays', ParseIntPipe) banDurationDays: number
    ) {
        return this.banService.banUser(banUserId, manager.id, banDurationDays)
    }


    @Post('user/unban/nickname')
    @Roles(RolesEnumType.ADMIN)
    unban(
        @User() manager: UsersModel,
        @Body() dto: UnbanUserDto,
    ) {
        return this.banService.unbanUser(dto, manager.id)
    }


}