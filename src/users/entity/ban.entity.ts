import { IsBoolean, IsOptional, IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity_base";
import { Column, Entity, ManyToOne } from "typeorm";
import { UsersModel } from "./users.entity";

@Entity()
export class BanModel extends BaseModel {

    @Column()
    @IsString()
    bannedUserId: string;

    @Column()
    @IsString()
    reason: string;


    @Column({ default: false })
    @IsBoolean()
    @IsOptional()
    isPermission: boolean;


    @ManyToOne(() => UsersModel, (user) => user.banForms)
    user: UsersModel;
}