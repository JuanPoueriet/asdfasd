// Interfaces que coinciden con los DTOs del Backend
export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystemRole: boolean;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
  permissions: string[];
}

export type UpdateRoleDto = Partial<CreateRoleDto>;
