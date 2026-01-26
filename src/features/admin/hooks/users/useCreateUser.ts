import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { CreateUser } from "../../types/userTypes";
import { useGlobalError } from "hooks/useGlobalError";


export function useCreateUser() {
    const mutation = useMutation(api.users.mutations.createUser);
    const { handleError } = useGlobalError();
    const createUserHandler = async (input: CreateUser) => {
        try {
            return await mutation(input);
        } catch (err) {
            handleError(err)
        }
    };

    return { createUserHandler };
}


