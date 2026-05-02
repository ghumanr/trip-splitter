import React, { createContext, useState} from 'react';

interface AuthContextType {

isAuthenticated: boolean;

login:(email:string, password:string) => Promise<void>; 

logout:() => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const useAuth = () => {
    const context = React.useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

interface AuthProviderProps {
    children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    
    const login = async (_email: string, _password: string) => {
        setIsAuthenticated(true);
    };

    const logout = () => {
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};