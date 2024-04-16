import { SetMetadata } from "@nestjs/common";
import { RolesEnumType } from "../enum/roles.enum";


export const ROLES_KEY = 'roles_user';

export const Roles = (role: RolesEnumType) => SetMetadata(ROLES_KEY, role);