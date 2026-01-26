import { useGetUser } from "features/admin/hooks/users/useGetUser";

export type AdminAuthContext = {
  userResponse: ReturnType<typeof useGetUser>;
};
