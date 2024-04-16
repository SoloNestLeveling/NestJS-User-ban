import { IsBoolean, IsDate, IsEmail, IsEnum, IsNumber, IsObject, IsOptional, IsString, isObject } from "class-validator";
import { BaseModel } from "src/common/base/entity_base";
import { Column, Entity, OneToMany } from "typeorm";
import { BanModel } from "../ban/entity/ban.entity";
import { PostsModel } from "src/posts/entity/posts.entity";
import { banUser } from "../interface/ban-user.interface";
import { RolesEnumType } from "../enum/roles.enum";
import { Transform } from "class-transformer";


@Entity()
export class UsersModel extends BaseModel {

    @Column()
    @IsEmail()
    email: string;


    @Column()
    @IsString()
    password: string;

    @Column()
    @IsString()
    nickname: string;

    @Column({ default: 0 })
    @IsNumber()
    @IsOptional()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesEnumType.BAN) {
            return value;
        } else {
            return undefined;
        }
    })
    banCount: number;



    @Column({ default: false })
    @IsBoolean()
    @IsOptional()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesEnumType.BAN) {
            return value;
        } else {
            return undefined;
        }
    })
    isBanned: boolean;



    @Column({ nullable: true })
    @IsDate()
    @IsOptional()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesEnumType.BAN) {
            return value;
        } else {
            return undefined;
        }
    })
    banExpiration?: Date;


    @Column('jsonb', { default: [] })
    @IsObject()
    @Transform(({ value, obj }) => {
        if (obj.role === RolesEnumType.ADMIN) {
            return value;
        } else {
            return undefined;
        }
    })
    banList: banUser[]


    @Column({ default: RolesEnumType.USER })
    @IsEnum(RolesEnumType)
    @IsOptional()
    role: RolesEnumType


    @OneToMany(() => BanModel, (ban) => ban.user)
    banForms: BanModel[];


    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostsModel[];






}