import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCurrentUser = createParamDecorator(
  (key: string | undefined,context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest()

    if (!key) return request.user

    return request.user[key]
  }
)