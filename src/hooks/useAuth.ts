import { useMutation, useQuery } from "@tanstack/react-query";
import { login as loginApi, getMe, register as registerApi } from "@/api/authApi";
import { useAuthStore } from "@/store/authStore";
import { LoginPayload, LoginResponse, RegisterPayload, User } from "@/types/auths";
import { useEffect } from "react";

//  login hook
export function useLogin() {
  const { login } = useAuthStore();

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: loginApi,
    onSuccess: (data) => {
      const user: User = {
        email: data.userEmail,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        lastLogin: data.lastLogin,
      };

      login(user, data.token);
    },
  });
}

//  register hook 
export function useRegister() {
  const { login } = useAuthStore();

  return useMutation<LoginResponse, Error, RegisterPayload>({
    mutationFn: registerApi,
    onSuccess: (data) => {
      const user: User = {
        email: data.userEmail,
        role: data.role,
        firstName: data.firstName,
        lastName: data.lastName,
        lastLogin: data.lastLogin,
      };

      login(user, data.token);
    },
  });
}

//  get profile hook
export function useMe() {
  const { user } = useAuthStore();
  const authStoreLogin = useAuthStore((state) => state.login);

  const queryResult = useQuery<User, Error>({
    queryKey: ["me"],
    queryFn: getMe,
    enabled: !user, 
  });

  useEffect(() => {
    if (queryResult.isSuccess && queryResult.data) {
      const token = localStorage.getItem("token");
      if (token) {
        authStoreLogin(queryResult.data, token);
      }
    }
  }, [queryResult.isSuccess, queryResult.data, authStoreLogin]);

  return queryResult;
}
