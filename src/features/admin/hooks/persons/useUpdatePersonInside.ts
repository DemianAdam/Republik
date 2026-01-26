import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { UpdatePersonInside } from "../../types/personTypes";
import { useGlobalError } from "hooks/useGlobalError";

export function useUpdatePersonInside() {
    const { handleError } = useGlobalError();
    const mutation = useMutation(api.persons.mutations.setIsInside).withOptimisticUpdate(
        (localStore, args) => {
            const queries = localStore.getAllQueries(api.persons.queries.getAllPaginated);
            for (const query of queries) {
                if (!query.value) {
                    continue;
                }

                const newPage = query.value.page.map(person =>
                    person._id === args.personId
                        ? { ...person, isInside: args.isInside }
                        : person
                );
                localStore.setQuery(
                    api.persons.queries.getAllPaginated,
                    query.args,
                    { ...query.value, page: newPage },
                );
            }
        });

    const updatePersonInsideHandler = async (input: UpdatePersonInside) => {
        try {
            return await mutation(input);
        } catch (err) {
            handleError(err);
        }
    };

    return { updatePersonInsideHandler };
}