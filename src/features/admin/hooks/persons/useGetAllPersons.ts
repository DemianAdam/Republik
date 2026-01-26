import { useNextPrevPaginatedQuery } from "convex-use-next-prev-paginated-query";
import { api } from "convex/_generated/api";
import { Id } from "convex/_generated/dataModel";
import { useEffect, useState } from "react";

function useDebounced<T>(value: T, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}

export function useGetAllPersons() {
    const [userId, setUserId] = useState<Id<"users"> | undefined>(undefined);
    const [searchName, setSearchName] = useState<string | undefined>(undefined);
    const debouncedSearch = useDebounced(searchName, 10);
    
    const result = useNextPrevPaginatedQuery(api.persons.queries.getAllPaginated, {
        name: debouncedSearch,
        userId: userId
    }, {
        initialNumItems: 15
    });

    return {
        user: {
            value: userId,
            set: setUserId
        },
        searchName: {
            value: searchName,
            set: setSearchName
        },
        result
    }
}