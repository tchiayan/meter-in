import { View, Text , StyleSheet , ScrollView , Alert } from 'react-native';
import { Card , Avatar , Button , ListItem , BottomSheet , Input } from '@rneui/themed';
import { getAuth } from 'firebase/auth';
import { CameraView , useCameraPermissions } from 'expo-camera';
import * as Location from 'expo-location';
import { Image } from 'expo-image';
import React from 'react';
import { Icon } from '@rneui/base';
import moment from 'moment';
import axios from 'axios';
import { router } from "expo-router";


export default function Index() {
    const auth = getAuth();
    // const [ isCheckingIn , setIsCheckingIn ] = React.useState(false)
    const [ checkInHistories , setCheckInHistories ] = React.useState([
    ])
    const [ permission , requestPermission ] = useCameraPermissions()
    const [ visible , setVisible ] = React.useState(false)
    const [ image , setImage ] = React.useState(null)
    const [ mileleage , setMileleage ] = React.useState(null)
    const [ location , setLocation ] = React.useState(null)
    const [ uploading , setUploading ] = React.useState(false)
    const isCheckingIn = React.useMemo(() => {
        if(checkInHistories.length === 0){
            return false
        }else{
            return checkInHistories[0].type === 'check-in'
        }
    } , [ checkInHistories ])

    // Get history 
    React.useEffect(() => {

        auth.currentUser.getIdToken().then((token) => {
            return axios.get(`${process.env.EXPO_PUBLIC_SERVER_URL}/history` , {
                headers: {
                    authorization: `Bearer ${token}`
                }
            })
        }).then((response) => {
            // Alert.alert("Success" )
            // do nothing
            setCheckInHistories(response.data)
        }).catch((error) => {
            Alert.alert("Error" , "Unable to get history data")
        })
    } , [])

    React.useEffect(() => {
        if(!visible){
            // clean up the image 
            setImage(null)
            setMileleage(null)
            setLocation(null)
        }
    } , [ visible])

    const cameraRef = React.useRef(null)
    const handleCheckIn = async () => {
        // check if camera permission is granted
        if(!permission?.granted){
            Alert.alert("Camera permission is required" , "Please allow camera permission to use this feature" , 
                [
                    { text: 'Grant Permission' , onPress: requestPermission }, 
                ]
            )
            return
        }

        let { status } = await Location.requestForegroundPermissionsAsync()
        if(status !== 'granted'){
            Alert.alert("Location permission is required" , "Please allow location permission to use this feature" ,
                [
                    { text: 'Grant Permission' , onPress: () => Location.requestForegroundPermissionsAsync() }
                ]
            )
            return 
        }
        setVisible(true)
        Location.getCurrentPositionAsync().then(_location => {
            setLocation({"lat":_location.coords.latitude , "lng":_location.coords.longitude})
        })
    }

    const handleCheckOut = async () => { 
        // check if camera permission is granted
        if(!permission?.granted){
            Alert.alert("Camera permission is required" , "Please allow camera permission to use this feature" , 
                [
                    { text: 'Grant Permission' , onPress: requestPermission }
                ]
            )
            return
        }

        let { status } = await Location.requestForegroundPermissionsAsync()
        if(status !== 'granted'){
            Alert.alert("Location permission is required" , "Please allow location permission to use this feature" ,
                [
                    { text: 'Grant Permission' , onPress: () => Location.requestForegroundPermissionsAsync() }
                ]
            )
            return 
        }
        setVisible(true)
        Location.getCurrentPositionAsync().then(_location => {
            setLocation({"lat":_location.coords.latitude , "lng":_location.coords.longitude})
        })
    }

    return (
        <View style={styles.container}>
            <Card>
                <View style={styles.chartTitle}>
                    <Avatar title={auth.currentUser?.email?.slice(0,1) ?? 'A'} rounded containerStyle={styles.avatar}>
                    </Avatar>
                    <Text>
                        {auth.currentUser?.email}
                    </Text>
                    <View style={{flexGrow: 1}}></View>
                    <Button type='clear' onPress={() => {
                        auth.signOut().then(() => {
                            // go to home 
                            router.replace('/')
                        })
                    }}>
                        <Icon name='logout' style={{color: 'gray'}} />
                    </Button>
                </View>
                <Card.Divider />
                <View style={styles.cardAction}>
                    <Button buttonStyle={{borderRadius: 30}} style={styles.cardActionButton} title="Check in" containerStyle={styles.cardActionButton} disabled={isCheckingIn} onPress={() => handleCheckIn()} />
                    <Button buttonStyle={{borderRadius: 30}} style={styles.cardActionButton} title="Check out" containerStyle={styles.cardActionButton} disabled={!isCheckingIn} onPress={() => handleCheckOut()} />
                </View>
            </Card>

            <Text style={styles.historyText}>History</Text>
            <ScrollView>
                {checkInHistories.map((history , index) => (
                    <ListItem key={index} bottomDivider={index!==(checkInHistories.length-1)} style={styles.listItem} >
                        <ListItem.Content>
                            <ListItem.Title>{history.type === 'check-in' ? "Check In" : "Check Out"}</ListItem.Title>
                            <ListItem.Subtitle>Time: {moment(history.timestamp , "YYYY-MM-DD HH:mm").calendar()}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                ))}
                {checkInHistories.length === 0 && <Text style={{textAlign: 'center', padding: 20}}>No history</Text>}
            </ScrollView>

            <BottomSheet modalProps={{transparent: false , presentationStyle:"pageSheet"}} isVisible={visible} style={{flex:1, justifyContent: 'flex-start'}} >
                <ScrollView automaticallyAdjustKeyboardInsets={true}>
                    <View style={{gap: 20, justifyContent: 'center' , alignItems:'center', margin: 20}}>
                        <Button type="clear" disabled={uploading} onPress={()=>setVisible(false)}>
                            <Icon name='close' />
                        </Button>
                        {image === null && <CameraView ref={cameraRef} style={{height: 200, borderRadius: 20 , overflow: 'hidden', width:'100%'}} facing={'back'}>

                        </CameraView>}
                        {image !== null && <View style={{height: 200, borderRadius: 20 , overflow: 'hidden', width: '100%'}}>
                            <Image source={{uri: image.uri}} style={{height: 200 , width: '100%'}} />   
                        </View>}
                        <Input placeholder='Mileage' keyboardType='number-pad' returnKeyType='done' value={mileleage} onChangeText={(text) => setMileleage(parseInt(text))} />
                        <Text>Location: {location === null ? 'Waiting GPS' : `${location.lat?.toFixed(6)} , ${location.lng?.toFixed(6)}`}</Text>
                        <View style={{flexDirection: 'row', gap: 20, width: '100%'}}>
                            <Button disabled={uploading} containerStyle={{flexGrow: 1}} buttonStyle={{borderRadius: 30}} title={image === null ? 'Take Picture': 'Retake'} onPress={() => {
                                if(image === null){``
                                    // take picture
                                    cameraRef.current?.takePictureAsync({base64: true}).then((result) => {
                                        const { height , width  , uri , base64 } = result
                                        setImage({
                                            height:height ,  
                                            width:width , 
                                            uri:uri, 
                                            base64:base64
                                        })
                                    })
                                }else{
                                    setImage(null)
                                }
                            }} />
                            <Button loading={uploading} containerStyle={{flexGrow: 1}} buttonStyle={{borderRadius: 30}} disabled={location === null || image === null || mileleage === null} title={"Submit"} onPress={() => {
                                
                                setUploading(true)
                                auth.currentUser.getIdToken().then((token) => {
                                    // axios post to server, including image data as well
                                    let formData = new FormData()
                                    formData.append('file' ,{name:"photo.jpg", type: 'image/jpeg' , uri: image.uri})
                                    formData.append('mileleage' , mileleage)
                                    formData.append('lat' , location.lat)
                                    formData.append('lng' , location.lng)
                                    formData.append('type' , isCheckingIn ? 'check-out' : 'check-in')
                                    formData.append('datetime', moment().format('YYYY-MM-DD HH:mm'))
                                    return axios.post(
                                        `${process.env.EXPO_PUBLIC_SERVER_URL}/meterin`  , 
                                        formData , 
                                        {
                                            headers: {
                                                authorization: `Bearer ${token}`, 
                                                'Content-Type': 'multipart/form-data'
                                            }
                                        }
                                    )
                                }).then((res) => {
                                    if(res.status === 200){
                                        setCheckInHistories((histories) => {
                                            // insert to the first index
                                            return [
                                                { timestamp: moment().format('YYYY-MM-DD HH:mm') , type: isCheckingIn ? 'check-out' : 'check-in' , mileleage: 1000},
                                                ...histories
                                            ]
                                        })
                                        setVisible(false)
                                    }else{
                                        Alert.alert("Error" , "Unable to check in/out. Server returned error")
                                    }
                                }).catch((err) => {
                                    Alert.alert("Error" , "Unable to check in/out. Unable to connect to server." + process.env.EXPO_PUBLIC_SERVER_URL)
                                    //Alert.alert("Error" , JSON.stringify(err))
                                }).finally(() => {
                                    setUploading(false)
                                })
                                
                                
                                
                            }} />
                        </View>
                        
                    </View>
                </ScrollView>
                
            </BottomSheet>
        </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        justifyContent: 'flex-start',
        alignItems: 'stretch',
    }, 
    avatar: {
        backgroundColor: '#bdbdbd'
    }, 
    chartTitle: {
        flexDirection: 'row', 
        alignItems: 'center',
        gap: 10, 
        marginBottom: 10
    }, 
    cardAction: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        gap: 20
    },
    cardActionButton: {
        flexGrow: 1, 
        flexShrink: 0,
    }, 
    historyText: {
        fontSize: 16,
        paddingLeft: 15, 
        paddingRight: 10, 
        paddingTop: 20, 
        paddingBottom: 10,
    }, 
    listItem: {
        paddingLeft: 15, 
        paddingRight: 15,
    }
})