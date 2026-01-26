import { ERROR_CODES, ErrorCode } from "convex/helpers/errors";


// Define the structure of an error message
interface UserError {
  title: string;
  description: string;
}

// The Dictionary
export const ERROR_MAP: Record<ErrorCode, UserError> = {
  // --- AUTHENTICATION ---
  [ERROR_CODES.AUTH_NOT_SIGNED_IN]: {
    title: "Sesión Expirada",
    description: "Tu sesión ha caducado. Por favor, recarga la página o inicia sesión nuevamente.",
  },
  [ERROR_CODES.AUTH_USER_NOT_FOUND]: {
    title: "Usuario No Encontrado",
    description: "No pudimos verificar tu identidad. Contacta a soporte.",
  },

  // --- PERMISSIONS ---
  [ERROR_CODES.PERMISSIONS_INSUFFICIENT]: {
    title: "Acceso Denegado",
    description: "No tienes los permisos necesarios para realizar esta acción.",
  },

  // --- USERS (ADMIN) ---
  [ERROR_CODES.USER_NOT_FOUND]: {
    title: "Usuario No Existe",
    description: "El usuario que intentas editar o eliminar no se encuentra en la base de datos.",
  },
  [ERROR_CODES.USER_CANNOT_DELETE_SELF]: {
    title: "Acción No Permitida",
    description: "Por seguridad, no puedes eliminar tu propia cuenta de administrador.",
  },
  [ERROR_CODES.USER_ACCOUNT_NOT_FOUND]: {
    title: "Error de Cuenta",
    description: "No se encontraron credenciales asociadas a este usuario.",
  },
  [ERROR_CODES.USER_EMAIL_ALREADY_EXISTS]: {
    title: "Email Duplicado",
    description: "Ya existe otro usuario registrado con este correo electrónico.",
  },

  // --- GUESTS / PERSONS ---
  [ERROR_CODES.PERSON_NOT_FOUND]: {
    title: "Invitado No Encontrado",
    description: "El invitado que buscas no existe o ya fue eliminado por otro usuario.",
  },
  [ERROR_CODES.PERSON_DELETE_NOT_ALLOWED]: {
    title: "Sin Permisos de Eliminación",
    description: "Solo puedes eliminar a los invitados que tú agregaste personalmente.",
  },
  [ERROR_CODES.PERSON_UPDATE_NOT_ALLOWED]: {
    title: "Edición Restringida",
    description: "Solo tienes permiso para editar los datos de tus propios invitados.",
  },
  [ERROR_CODES.PERSON_ALREADY_INSIDE]: {
    title: "Invitado Ya Ingresado",
    description: "Esta persona ya figura como 'Adentro'.",
  },
  [ERROR_CODES.PERSON_ALREADY_OUTSIDE]: {
    title: "Invitado Ya Afuera",
    description: "Esta persona ya figura como 'Afuera'.",
  },

  // --- GENERIC ---
  [ERROR_CODES.UNKNOWN_ERROR]: {
    title: "Error Inesperado",
    description: "Ocurrió un error desconocido. Por favor intenta nuevamente.",
  },
  [ERROR_CODES.NETWORK_ERROR]: {
    title: "Error de Conexión",
    description: "Verifica tu conexión a internet e intenta nuevamente.",
  },
  [ERROR_CODES.PERSON_INVALID_QR]: {
    title: "QR Inválido",
    description: "El código QR escaneado no es válido.",
  },
  [ERROR_CODES.PERSON_UNDER_AGE]: {
    title: "Invitado Menor de Edad",
    description: "No se permite el ingreso de menores de edad.",
  },
  [ERROR_CODES.PERSON_ALREADY_CREATED]: {
    title: "Invitado Ya Registrado",
    description: "Este invitado ya ha sido creado previamente.",
  }, [ERROR_CODES.INVALID_DATA]: {
    title: "Datos Inválidos",
    description: "Los datos proporcionados no son correctos o están incompletos.",
  },
  //TODO: create messages
  [ERROR_CODES.QR_NOT_FOUND]: {
    title: "",
    description: ""
  },
  [ERROR_CODES.PERSON_VIP_CODE_NOT_FOUND]: {
    title: "",
    description: ""
  }
};

/**
 * Helper function to safely get an error message.
 * Falls back to UNKNOWN_ERROR if the code is not in the map.
 */
export const getErrorFromCode = (code: string): UserError & { code: string } => {
  // Check if the string matches a known code
  const knownError = Object.values(ERROR_CODES).includes(code as ErrorCode)
    ? ERROR_MAP[code as ErrorCode]
    : undefined;

  if (knownError) {
    return { ...knownError, code };
  }

  // Fallback for completely unknown errors (e.g. standard Convex errors not in our list)
  return {
    ...ERROR_MAP[ERROR_CODES.UNKNOWN_ERROR],
    code: code || "NO_CODE",
  };
};