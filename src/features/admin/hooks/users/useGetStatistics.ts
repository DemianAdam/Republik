import { api } from "convex/_generated/api";
import { useQuery } from "hooks/useQueryWithStatus";

export function useGetStatistics(){
    return useQuery(api.users.queries.getStatistics);
}