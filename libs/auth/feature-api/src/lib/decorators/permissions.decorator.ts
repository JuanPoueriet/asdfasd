
import { SetMetadata } from '@nestjs/common';
import { Permission } from '@univeex/shared/util-common';

export const PERMISSIONS_KEY = 'permissions';
export const HasPermission = (...permissions: Permission[]) => SetMetadata(PERMISSIONS_KEY, permissions);
