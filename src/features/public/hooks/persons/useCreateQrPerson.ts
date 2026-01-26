import { api } from "convex/_generated/api";
import { useMutation } from "convex/react";
import { CreateQrPersonInfo } from "features/admin/types/personTypes";


export function useCreateQrPerson() {
    const mutation = useMutation(api.persons.mutations.createQrPerson);
    const createQrPersonHandler = async (input: CreateQrPersonInfo) => {
        try {
            return await mutation(input);
        } catch (error) {
            //TODO:handle error;
            console.log(error);
            
            throw error;
        }
    }

    return { createQrPersonHandler }
}