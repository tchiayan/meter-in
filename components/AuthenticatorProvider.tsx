import React from 'react';
import { useStorageState } from '@/hooks/useStorageState';

const AuthContext = React.createContext({
    signIn: null , 
    signOut: null , 
    session: null , 
    isLoading: false
})


