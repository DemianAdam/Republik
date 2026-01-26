import { api } from "convex/_generated/api";
import { useQuery } from "convex/react";

export function useGetPersonsCounters() {
    return useQuery(api.persons.queries.getPersonsCounter);
}