import * as SecureStore from 'expo-secure-store';
import * as React from 'react'
import { Platform } from 'react-native';

function useAsyncState(initalValue){
    return React.useReducer((state, action) => action, initalValue)
}

export async function setStorageItemAsync(key , value){
    if(Platform.OS === 'web'){
        try {
            if (value === null) {
              localStorage.removeItem(key);
            } else {
              localStorage.setItem(key, value);
            }
        } catch (e) {
            console.error('Local storage is unavailable:', e);
        }
    }else{
        if( value === null){
            await SecureStore.deleteItemAsync(key)
        }else{
            await SecureStore.setItemAsync(key, value)
        }
    }
}

export function useStorageState(key){
    // Public 
    const [ state , setState ] = useAsyncState(null)

    // Get 
    React.useEffect(() => {
        if(Platform.OS === 'web'){
            try {
                const value = localStorage.getItem(key)
                setState(value)
            } catch (e) {
                console.error('Local storage is unavailable:', e);
            }
        }else{
            SecureStore.getItemAsync(key).then(value => setState(value))
        }
    } , [ key ])

    // Set 
    const setValue = React.useCallback((value) => {
        setState(value)
        setStorageItemAsync(key , value)
    } , [ key ])

    return [ state , setValue ]
}