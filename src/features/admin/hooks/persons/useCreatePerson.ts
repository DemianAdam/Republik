import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { CreatePerson } from "../../types/personTypes";
import { useGlobalError } from "hooks/useGlobalError";

export function useCreatePerson() {
    const mutation = useMutation(api.persons.mutations.createPerson);
    const { handleError } = useGlobalError();
    const createPersonHandler = async (input: CreatePerson) => {
        try {
            return await mutation(input);
        } catch (err) {
            handleError(err);
        }

    };


    return { createPersonHandler };
}