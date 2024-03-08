import { IsBoolean, IsDate, IsEmail, IsEnum, IsNumber, IsObject, IsOptional, IsString, isObject } from "class-validator";
import { BaseModel } from "src/common/base/entity_base";
import { Column, Entity, OneToMany } from "typeorm";
import { BanModel } from "./ban.entity";
import { PostsModel } from "src/posts/entity/posts.entity";

export enum RolesEnumType {

    ADMIN = 'ADMIN',
    USER = 'USER'
};


export interface banUserList {

    email: string,
    password: string,
    nickname: string,
}

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
    banCount: number;

    @Column({ nullable: true })
    @IsBoolean()
    @IsOptional()
    isBanned?: boolean;

    @Column({ nullable: true })
    @IsDate()
    @IsOptional()
    banExpiration: Date;


    @Column('jsonb', { default: [] })
    @IsObject()
    banList: banUserList[]


    @Column({ default: RolesEnumType.USER })
    @IsEnum(RolesEnumType)
    role: RolesEnumType;


    @OneToMany(() => BanModel, (ban) => ban.user)
    banForms: BanModel[];


    @OneToMany(() => PostsModel, (post) => post.author)
    posts: PostsModel[];






}