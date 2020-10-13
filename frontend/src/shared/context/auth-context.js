import { createContext } from 'react';

export const AuthContext = createContext({
    isLoggedIn: false,
    user: {},
    token: null,
    login: () => {},
    logout: () => {}
})