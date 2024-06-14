import { Text, View , StyleSheet , TextInput , Button , Alert } from "react-native";
import { useState , useEffect } from "react";
import { Input , Button as RNButton } from "@rneui/themed";
import { SafeAreaProvider  } from "react-native-safe-area-context";
import { getAuth , signInWithEmailAndPassword } from "firebase/auth";
import { router } from "expo-router";

export default function Index() {

  const auth = getAuth();
  const [ email , setEmail ] = useState('')
  const [ password , setPassword ] = useState('')
  const [ showPassword, setShowPassword ] = useState(false)
  const [ loading , setLoading ] = useState(false)

  useEffect(() => {
    let user = auth.currentUser;
    if(user){
      // Alert.alert("Already logged in")
      router.replace("/app/(app)/index")
    }
  } , [])


  return (
    <SafeAreaProvider>
      <View
        style={styles.container}
      >
        <Input label="Email" value={email} inputMode="email" autoComplete="email" onChangeText={(text) => setEmail(text)}/>
        <View style={styles.passwordContainer}>
          <Input containerStyle={styles.passwordInput} label="Password"  autoComplete="current-password" secureTextEntry={!showPassword} value={password} onChangeText={(text) => setPassword(text)} />
          <RNButton title={showPassword ? 'Hide' : 'Show'} onPress={() => setShowPassword(!showPassword)} type="clear" />
        </View>
        <RNButton title="Login" disabled={email.trim() === "" || password.trim() === ""} loading={loading} onPress={()=>{
          
          setLoading(true)
          signInWithEmailAndPassword(auth , email , password).then(() => {
            setLoading(false)
            Alert.alert("Login successful")
            router.replace("/(app)")
          }).catch((err) => {
            setLoading(false)
            Alert.alert("Login failed" , `${err.code} - ${err.message}`)
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


