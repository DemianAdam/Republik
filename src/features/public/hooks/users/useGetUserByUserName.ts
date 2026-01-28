import { api } from "convex/_generated/api";
import { useQuery } from "hooks/useQueryWithStatus";


export function useGetUserByUserName(userName: string | undefined) {
    return useQuery(api.users.queries.getUserIdByUserName, { userName: userName ?? "skip" });
}