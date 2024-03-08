import { SetMetadata } from "@nestjs/common";

export const PUBLIC_KEY = 'public_user';

export const IsPublic = () => SetMetadata(PUBLIC_KEY, true);