import { PickType } from "@nestjs/mapped-types";
import { IsString } from "class-validator";

export class UnbanUserDto {

    @IsString()
    nickname: string;
}