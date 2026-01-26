import { api } from "convex/_generated/api";
import { useConvex } from "convex/react";

export function useGetQrByDni() {
    const convex = useConvex();
    const getQrByDni = async (dni: number) => {
        return await convex.query(api.persons.queries.getQrByDni, { dni })
    }
    return { getQrByDni }
}