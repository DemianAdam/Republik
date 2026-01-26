import { api } from "convex/_generated/api";
import { useQuery } from "hooks/useQueryWithStatus";

export function useValidateQr(uuid: string | undefined) {
    return useQuery(api.persons.queries.validateQr, { uuid: uuid ?? "skip" });
}