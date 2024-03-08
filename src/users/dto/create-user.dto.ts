import { PickType } from "@nestjs/mapped-types";
import { UsersModel } from "../entity/users.entity";

export class CreateUserDto extends PickType(UsersModel, ['email', 'password', 'nickname']) { }