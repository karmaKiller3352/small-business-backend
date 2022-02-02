import { SetMetadata } from "@nestjs/common";

export const SetPublicRoute = () => SetMetadata("isPublic", true)