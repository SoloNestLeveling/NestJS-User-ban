import { PickType } from "@nestjs/mapped-types";
import { BanModel } from "../entity/ban.entity";
import { IsNumber } from "class-validator";

export class CreateBanDto extends PickType(BanModel, ['bannedUserId', 'reason']) { }