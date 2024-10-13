import { Text, View , StyleSheet , TextInput , Button , Alert } from "react-native";
import { useState , useEffect, useCallback } from "react";
import { Input , Button as RNButton } from "@rneui/themed";
import { SafeAreaProvider  } from "react-native-safe-area-context";
import { getAuth , signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync()

export default function Index() {

  const auth = getAuth();
  const [ email , setEmail ] = useState('')
  const [ password , setPassword ] = useState('')
  const [ showPassword, setShowPassword ] = useState(false)
  const [ loading , setLoading ] = useState(false)
  const [ appReady , setAppReady ] = useState(false)

  useEffect(() => {
    
    let sub_user = auth.onAuthStateChanged((user) => {
      if(user){
        router.replace("/(app)")
      }
      setAppReady(true)
    })
    // let user = auth.currentUser;
    // if(user){
    //   // Alert.alert("Already logged in")
    //   router.replace("/app/(app)/index")
    // }
    return () => {
      if(sub_user){
        sub_user()
      }
    }
  } , [])


  useCallback(async () => {
    if(appReady){
      await SplashScreen.hideAsync()
    }
  } , [ appReady])

  if(!appReady){
    return null
  }

  return (
    <SafeAreaProvider>
      <View
        style={styles.container}
      >
        <Input returnKeyType="done" label="Email" value={email} inputMode="email" autoComplete="email" onChangeText={(text) => setEmail(text)}/>
        <View style={styles.passwordContainer}>
          <Input returnKeyType="done" containerStyle={styles.passwordInput} label="Password"  autoComplete="current-password" secureTextEntry={!showPassword} value={password} onChangeText={(text) => setPassword(text)} />
          <RNButton title={showPassword ? 'Hide' : 'Show'} onPress={() => setShowPassword(!showPassword)} type="clear" />
        </View>
        <RNButton title="Login" disabled={email.trim() === "" || password.trim() === ""} loading={loading} onPress={()=>{
          
          setLoading(true)
          signInWithEmailAndPassword(auth , email , password).then(() => {
            setLoading(false)
            // Alert.alert("Login successful")
            // router.replace("/(app)")
          }).catch((err) => {
            setLoading(false)
            Alert.alert("Login failed")
          })
        }}/>
      </View>
    </SafeAreaProvider>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',

    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    gap: 10,
    paddingLeft: 20, 
    paddingRight: 20,
    paddingBottom: 20
  },
  passwordContainer: {
    flexDirection: 'row', 
    alignItems: "center",
  }, 
  passwordInput: {
    flexShrink: 1
  },
  input: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    alignItems: 'center', 
    justifyContent: 'center',
  },
});


