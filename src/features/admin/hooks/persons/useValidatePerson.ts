import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";

export function useValidatePerson() {
    const mutation = useMutation(api.persons.mutations.validatePerson);
    const validatePersonHandler = async (input: string) => {
        try {
            return await mutation({ qrData: input });
        } catch (error) {
            console.log(error);          
            throw error;
        }
    }

    return { validatePersonHandler }
}