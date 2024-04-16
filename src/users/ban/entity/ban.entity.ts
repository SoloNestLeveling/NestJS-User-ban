import { IsBoolean, IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity_base";
import { Column, Entity, ManyToOne } from "typeorm";
import { UsersModel } from "../../entity/users.entity";

@Entity()
export class BanModel extends BaseModel {

    @Column()
    @IsString()
    banUserId: string;

    @Column()
    @IsString()
    reason: string;


    @ManyToOne(() => UsersModel, (user) => user.banForms)
    user: UsersModel;
}