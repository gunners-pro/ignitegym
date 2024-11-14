import { createContext, ReactNode, useEffect, useState } from 'react';

import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';
import { storageAuthTokenSave } from '@storage/storageAuthToken';
import {
  storageUserGet,
  storageUserSave,
  storateUserRemove,
} from '@storage/storageUser';

export type AuthContextDataProps = {
  user: UserDTO;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);

  async function storageUserAndToken(userStorage: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;

    await storageUserSave(userStorage);
    await storageAuthTokenSave(token);
    setUser(userStorage);
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password });

      if (data.user && data.token) {
        storageUserAndToken(data.user, data.token);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setUser({} as UserDTO);
      await storateUserRemove();
    } catch (error) {
      throw error;
    }
  }

  async function loadUserData() {
    const userLogged = await storageUserGet();
    if (userLogged) {
      setUser(userLogged);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
