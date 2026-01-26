import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { DeletePerson } from "../../types/personTypes";
import { useGlobalError } from "hooks/useGlobalError";



export function useDeletePerson() {
    const mutation = useMutation(api.persons.mutations.deletePerson);
    const { handleError } = useGlobalError();
    const deletePersonHandler = async (input: DeletePerson) => {
        try {
            return await mutation(input);
        } catch (err) {
            handleError(err)
        }
    };

    return { deletePersonHandler };
}
