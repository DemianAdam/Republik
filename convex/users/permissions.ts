export type Role = (typeof VALID_ROLES)[keyof typeof VALID_ROLES];

export const VALID_ROLES = {
  DOOR: "door",
  RRPP: "rrpp",
  ADMIN: "admin",
} as const;

export const roleHierarchy: Record<Role, number> = {
  door: 1,
  rrpp: 2,
  admin: 3,
};
export const PERMISSIONS = {
  CREATE_PERSON: "create_person",
  DELETE_PERSON: "delete_person",
  UPDATE_PERSON: "update_person",
  SETINSIDE_PERSON: "set_inside_person",
  MANAGE_USERS: "manage_users",
} as const;

export type Permission =
  typeof PERMISSIONS[keyof typeof PERMISSIONS];

const doorPermissions = [
  PERMISSIONS.SETINSIDE_PERSON,
] as const satisfies readonly Permission[];

const rrppPermissions = [
  PERMISSIONS.CREATE_PERSON,
  PERMISSIONS.DELETE_PERSON,
  PERMISSIONS.UPDATE_PERSON,
] as const satisfies readonly Permission[];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS) as readonly Permission[];


export const rolePermissions: Record<Role, readonly Permission[]> = {
  door: doorPermissions,
  rrpp: rrppPermissions,
  admin: ALL_PERMISSIONS,
};

