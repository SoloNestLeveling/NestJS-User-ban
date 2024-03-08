import { SetMetadata } from "@nestjs/common";
import { RolesEnumType } from "../entity/users.entity";

export const ROLES_KEY = 'roles_user';

export const Roles = (role: RolesEnumType) => SetMetadata(ROLES_KEY, role);