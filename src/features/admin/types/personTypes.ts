import type { Doc, Id } from "convex/_generated/dataModel";
import { WithoutSystemFields } from "convex/server";
export type Person = Doc<"persons">;
export type CreateQrPersonInfo = {
  qrData: string,
  userId: Id<"users">,
  vipCode?: string | undefined,
}
export type CreateQrPerson = {
  fullname: string,
  dni: number,
}
export type CreatePerson = WithoutSystemFields<Omit<Person, "isInside" | "userId" | "qrCode">>
export const emptyCreatePerson: CreatePerson = {
  fullname: "",
  isVip: false,
  dni: 0
}
export type DeletePerson = { personId: Id<"persons"> }

export type UpdatePerson = {
  personId: Id<"persons">;
} & Omit<CreatePerson, "userId">;

export type GetByUserId = {
  userId: Id<"users">
}

export type UpsertPerson = CreatePerson | UpdatePerson;

export type UpdatePersonInside = {
  personId: Id<"persons">,
  isInside: boolean
}

export const createPersonFromUpdatePerson = (person: UpdatePerson | null): CreatePerson => {
  return person ?? emptyCreatePerson
}