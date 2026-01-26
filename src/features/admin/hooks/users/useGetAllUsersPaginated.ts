import { useNextPrevPaginatedQuery } from "convex-use-next-prev-paginated-query";
import { api } from "convex/_generated/api";
import { UserRole } from "features/admin/types/userTypes";
import { useState } from "react";

export function useGetAllUsers() {
    const [searchRole, setSearchRole] = useState<UserRole | undefined>(undefined);

    const result = useNextPrevPaginatedQuery(api.users.queries.getAllPaginated, {
        role: searchRole,
    }, {
        initialNumItems: 15
    });

    return {
        searchRole: {
            value: searchRole,
            set: setSearchRole
        },
        result
    }
}