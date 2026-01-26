import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { useGlobalError } from "hooks/useGlobalError";

export function useDeleteAllPersons() {
    const personMutation  = useMutation(api.persons.mutations.deleteList)
    const { handleError } = useGlobalError();
    const deleteAllPersonsListHandler = async () => {
        try {
             await personMutation();
        } catch (err) {
            handleError(err);
        }

    };

    return { deleteAllPersonsListHandler };
}