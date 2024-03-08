import { IsString } from "class-validator";
import { BaseModel } from "src/common/base/entity_base";
import { UsersModel } from "src/users/entity/users.entity";
import { Column, Entity, ManyToOne } from "typeorm";

@Entity()
export class PostsModel extends BaseModel {

    @Column()
    @IsString()
    title: string;

    @Column()
    @IsString()
    content: string;


    @ManyToOne(() => UsersModel, (user) => user.posts)
    author: UsersModel;
}