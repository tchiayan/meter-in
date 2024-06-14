import { View, Text , StyleSheet , ScrollView , Alert } from 'react-native';
import { Card , Avatar , Button , ListItem , BottomSheet } from '@rneui/themed';
import { getAuth } from 'firebase/auth';
import { CameraView , useCameraPermissions } from 'expo-camera';
import React from 'react';



export default function Index() {
    const auth = getAuth();
    const [ isCheckingIn , setIsCheckingIn ] = React.useState(false)
    const [ checkInHistories , setCheckInHistories ] = React.useState([
        { timestamp: '2022-01-01 08:00:00' , type: 'check-in' , mileleage: 1000},
        { timestamp: '2022-01-01 12:00:00' , type: 'check-out' , mileleage: 1000},
        { timestamp: '2022-01-01 13:00:00' , type: 'check-in' , mileleage: 1000},
        { timestamp: '2022-01-01 17:00:00' , type: 'check-out' , mileleage: 1000},
        { timestamp: '2022-01-01 18:00:00' , type: 'check-in' , mileleage: 1000},
    ])
    const [ permission , requestPermission ] = useCameraPermissions()
    const [ visible , setVisible ] = React.useState(false)
    const handleCheckIn = () => {
        // check if camera permission is granted
        if(!permission?.granted){
            Alert.alert("Camera permission is required" , "Please allow camera permission to use this feature" , 
                [
                    { text: 'Grant Permission' , onPress: requestPermission }
                ]
            )
            return
        }
        setVisible(true)
    }

    const handleCheckOut = () => { 
        // check if camera permission is granted
        if(!permission?.granted){
            Alert.alert("Camera permission is required" , "Please allow camera permission to use this feature" , 
                [
                    { text: 'Grant Permission' , onPress: requestPermission }
                ]
            )
            return
        }
        setVisible(true)
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
                </View>
                <Card.Divider />
                <View style={styles.cardAction}>
                    <Button style={styles.cardActionButton} title="Check in" containerStyle={styles.cardActionButton} disabled={isCheckingIn} onPress={() => handleCheckIn()} />
                    <Button style={styles.cardActionButton} title="Check out" containerStyle={styles.cardActionButton} disabled={!isCheckingIn} onPress={() => handleCheckOut()} />
                </View>
            </Card>

            <Text style={styles.historyText}>History</Text>
            <ScrollView>
                {checkInHistories.map((history , index) => (
                    <ListItem key={index} bottomDivider={index!==(checkInHistories.length-1)} style={styles.listItem} >
                        <ListItem.Content>
                            <ListItem.Title>{history.type === 'check-in' ? "Check In" : "Check Out"}</ListItem.Title>
                            <ListItem.Subtitle>Time: {history.timestamp}</ListItem.Subtitle>
                        </ListItem.Content>
                        <ListItem.Chevron />
                    </ListItem>
                ))}
            </ScrollView>

            <BottomSheet modalProps={{transparent: false , presentationStyle: "pageSheet"}} isVisible={visible}>
                <View style={{flex: 1, justifyContent: 'center'}}>
                    <CameraView style={{flex: 1}} facing={'front'}>

                    </CameraView>
                    <Button title={"Close"} onPress={()=>setVisible(false)}>Close</Button>
                </View>
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