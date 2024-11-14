import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useState,
} from 'react';

import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';
import {
  storageAuthTokenGet,
  storageAuthTokenRemove,
  storageAuthTokenSave,
} from '@storage/storageAuthToken';
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

  async function UserAndTokenUpdate(userStorage: UserDTO, token: string) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
    setUser(userStorage);
  }

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/sessions', { email, password });

      if (data.user && data.token) {
        await storageUserSave(data.user);
        await storageAuthTokenSave(data.token);

        UserAndTokenUpdate(data.user, data.token);
      }
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    try {
      setUser({} as UserDTO);
      await storateUserRemove();
      await storageAuthTokenRemove();
    } catch (error) {
      throw error;
    }
  }

  const loadUserData = useCallback(async () => {
    const userLogged = await storageUserGet();
    const token = await storageAuthTokenGet();
    if (userLogged && token) {
      UserAndTokenUpdate(userLogged, token);
    }
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
