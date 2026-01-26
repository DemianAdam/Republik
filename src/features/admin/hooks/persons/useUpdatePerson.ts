import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { UpdatePerson } from "../../types/personTypes";
import { useGlobalError } from "hooks/useGlobalError";

export function useUpdatePerson() {
    const mutation = useMutation(api.persons.mutations.updatePerson);
    const { handleError } = useGlobalError();
    const updatePersonHandler = async (input: UpdatePerson) => {
        try {
            return await mutation(input);
        } catch (err) {
            handleError(err);
        }
    };

    return { updatePersonHandler };
}