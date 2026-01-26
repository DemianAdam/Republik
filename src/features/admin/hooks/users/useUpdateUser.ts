import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { UpdateUser } from "../../types/userTypes";
import { useGlobalError } from "hooks/useGlobalError";

export function useUpdateUser() {
    const mutation = useMutation(api.users.mutations.updateUser);
    const { handleError } = useGlobalError();
    const updateUserHandler = async (input: UpdateUser) => {
        try {
            return await mutation(input);
        } catch (err) {
            handleError(err);
        }
    };

    return { updateUserHandler };
}
