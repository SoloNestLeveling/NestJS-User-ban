import { SetMetadata } from "@nestjs/common";
import { PublicEnumType } from "../enum/public.enum";

export const PUBLIC_KEY = 'public_user';

export const IsPublic = (type: PublicEnumType) => SetMetadata(PUBLIC_KEY, type);