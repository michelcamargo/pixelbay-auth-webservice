import { SetMetadata } from '@nestjs/common';

export const Permissions = (...permissions: string[]) => {
  console.log({ permissions });

  return SetMetadata('permissions', permissions);
};
