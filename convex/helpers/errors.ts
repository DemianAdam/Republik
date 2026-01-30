export const ERROR_CODES = {
  // --- AUTHENTICATION & SESSION ---
  AUTH_NOT_SIGNED_IN: "auth_not_signed_in",
  AUTH_USER_NOT_FOUND: "auth_user_not_found",

  // --- PERMISSIONS (ROLES) ---
  PERMISSIONS_INSUFFICIENT: "permissions_insufficient",

  // --- USER MANAGEMENT (Users Entity) ---
  USER_NOT_FOUND: "user_not_found",
  USER_CANNOT_DELETE_SELF: "user_cannot_delete_self",
  USER_ACCOUNT_NOT_FOUND: "user_account_not_found", // When trying to update email/pass but no auth record exists
  USER_EMAIL_ALREADY_EXISTS: "user_email_already_exists", // Implicit in createAccount, good to handle

  // --- PERSON/GUEST MANAGEMENT (Persons Entity) ---
  PERSON_NOT_FOUND: "person_not_found",
  PERSON_INVALID_QR: "person_invalid_qr",
  PERSON_UNDER_AGE: "person_under_age",
  PERSON_ALREADY_CREATED: "person_already_created",

  QR_NOT_FOUND: "qr_not_found",

  // Access Control / Ownership (Trying to edit/delete someone else's guest)
  PERSONS_LIST_NOT_ACTIVE: "persons_list_not_active",
  PERSONS_LIST_LIMIT_REACHED: "persons_list_limit_reached",
  PERSONS_LIST_DATE_LIMIT_REACHED: "persons_list_date_limit_reached",
  PERSON_DELETE_NOT_ALLOWED: "person_delete_not_allowed",
  PERSON_UPDATE_NOT_ALLOWED: "person_update_not_allowed",

  // Logic / State Errors
  PERSON_ALREADY_INSIDE: "person_already_inside", // Useful if UI sends an invalid toggle
  PERSON_ALREADY_OUTSIDE: "person_already_outside",
  PERSON_VIP_CODE_NOT_FOUND: "person_vip_code_not_found",

  // --- GENERIC / SYSTEM ---
  UNKNOWN_ERROR: "unknown_error",
  NETWORK_ERROR: "network_error",
  INVALID_DATA: "invalid_data",
  CONFIG_NOT_LOADED: "config_not_loaded"
} as const;

export const ERRORS = Object.values(ERROR_CODES)

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];