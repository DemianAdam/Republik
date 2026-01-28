import { api } from "convex/_generated/api";
import { useQuery } from "hooks/useQueryWithStatus";
export function useGetPersonsCounters() {
    return useQuery(api.persons.queries.getPersonsCounter);
}