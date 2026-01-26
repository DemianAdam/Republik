import { api } from "convex/_generated/api";
import { useQuery } from "../../../../hooks/useQueryWithStatus";

export function useGetUser() {
    return useQuery(api.users.queries.getCurrentUser);
}
