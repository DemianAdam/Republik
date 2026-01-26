import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { DeleteUser } from "../../types/userTypes";
import { useGlobalError } from "hooks/useGlobalError";


export function useDeleteUser() {
    const mutation = useMutation(api.users.mutations.deleteUser);
    const { handleError } = useGlobalError();
    const deleteUserHandler = async (input: DeleteUser) => {
        try {
            return await mutation(input);
        } catch (err) {
            handleError(err)
        }
    };

    return { deleteUserHandler };
}
