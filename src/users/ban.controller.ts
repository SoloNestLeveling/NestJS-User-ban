import { Body, Controller, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { BanService } from "./ban.service";
import { CreateBanDto } from "./dto/create-ban.dto";
import { User } from "./decorator/user.decorator";
import { UsersModel } from "./entity/users.entity";

@Controller('ban')
export class BanController {
    constructor(
        private readonly banService: BanService
    ) { }


    @Post(':id')
    createBan(
        @Body() dto: CreateBanDto,
        @Param('id', ParseIntPipe) id: number
    ) {

        return this.banService.createBan(dto, id);
    }

    @Post('user/:id')
    userBan(
        @User() user: UsersModel,
        @Param('id', ParseIntPipe) id: number,
        @Body('banDurationDays', ParseIntPipe) banDurationDays: number
    ) {
        return this.banService.banUser(id, user.id, banDurationDays)
    }


}