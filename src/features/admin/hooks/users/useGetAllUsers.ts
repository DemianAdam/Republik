import { api } from "convex/_generated/api";
import { useQuery } from "hooks/useQueryWithStatus";

export function useGetAllUsers() {
    return useQuery(api.users.queries.getAll);
}
