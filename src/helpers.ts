import { CreateQrPerson } from "features/admin/types/personTypes";

export function getInitials(string: string): string {
  return string
    .trim()
    .split(/\s+/)
    .map(word => word[0].toUpperCase())
    .join("");
}

export function getGuestDataFromQr(qrData: string): CreateQrPerson {
  // 1. Sanity Check: Ensure string isn't empty or obviously wrong
  if (!qrData || typeof qrData !== 'string') {
    throw new Error("QR inválido: Datos vacíos");
  }

  const parts = qrData.split("@");

  // 2. Validate Length (User Requirement: 9 fields)
  if (parts.length !== 9) {
    throw new Error(`QR inválido: Se esperaban 9 campos, se recibieron ${parts.length}`);
  }

  // --- Extract Raw Values ---
  const [
    rawTramite, // 0: Only numbers
    rawLastName, // 1: Letters and spaces
    rawName,    // 2: Letters and spaces
    rawSex,     // 3: One letter (M/F/X)
    rawDni,     // 4: Only numbers
    rawCopy,    // 5: One letter (Ejemplar A, B...)
    rawDob,     // 6: Date DD/MM/YYYY
    rawIssued,  // 7: Date DD/MM/YYYY
    rawCode     // 8: Only numbers
  ] = parts;


  // --- VALIDATIONS ---

  // Field 0, 4, 8: Strict Numbers Only
  if (!/^\d+$/.test(rawTramite)) throw new Error("Trámite inválido");
  if (!/^\d+$/.test(rawDni)) throw new Error("DNI inválido");
  if (!/^\d+$/.test(rawCode)) throw new Error("Código verificador inválido"); // Optional based on strictness

  // Field 1, 2: Letters AND Spaces (Fixes the "Juan Carlos" bug)
  // \p{L} = Any unicode letter, \s = whitespace, ' = apostrophe (optional)
  if (!/^[\p{L}\s']+$/u.test(rawLastName)) throw new Error("Apellido inválido (caracteres no permitidos)");
  if (!/^[\p{L}\s']+$/u.test(rawName)) throw new Error("Nombre inválido (caracteres no permitidos)");

  // Field 3, 5: Single Letter
  if (!/^[A-Za-z]$/.test(rawSex)) throw new Error("Sexo inválido");
  if (!/^[A-Za-z]$/.test(rawCopy)) throw new Error("Ejemplar inválido");

  // Field 6: Date Parsing with Zero Padding
  const birthday = parseDniDate(rawDob);
  if (!birthday) throw new Error("Fecha de nacimiento inválida");

  // Field 7: Issue Date (Optional: Validate it exists even if not used)
  const issuedDate = parseDniDate(rawIssued);
  if (!issuedDate) throw new Error("Fecha de emisión inválida");


  return {
    fullname: `${rawName} ${rawLastName}`,
    dni: Number(rawDni),
    //gender: rawSex,
    //tramite: Number(rawTramite)
  };
}

// Helper: Safely parses "DD/MM/YYYY" to "YYYY-MM-DD"
function parseDniDate(dateStr: string): string | null {
  const parts = dateStr.split("/");
  if (parts.length !== 3) return null;

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const year = Number(parts[2]);

  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;

  // Zero pad the output (e.g., "5" -> "05")
  const pad = (n: number) => n.toString().padStart(2, '0');

  return `${year}-${pad(month)}-${pad(day)}`;
}