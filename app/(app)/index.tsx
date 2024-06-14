import { View, Text , StyleSheet , ScrollView } from 'react-native';
import { Card , Avatar , Button , ListItem } from '@rneui/themed';
import { getAuth } from 'firebase/auth';
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
                    <Button style={styles.cardActionButton} title="Check in" containerStyle={styles.cardActionButton} disabled={isCheckingIn} />
                    <Button style={styles.cardActionButton} title="Check out" containerStyle={styles.cardActionButton} disabled={!isCheckingIn} />
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