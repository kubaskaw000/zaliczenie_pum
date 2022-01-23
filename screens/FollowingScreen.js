import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, TextInput } from 'react-native'
import { auth, db } from '../firebase'
import QRCode from "react-qr-code"
import firebase from 'firebase/compat/app';
import QRScanner from './QRScanner'


const FollowingScreen = () => {

    const userId = auth.currentUser.uid


    const followUser = (followerId) => {
        //console.log(followerId)
        //console.log(user.uid)

        console.log(userId, followerId)

        db.collection('followers').doc(userId).update({
            following: firebase.firestore.FieldValue.arrayUnion(followerId)
        });

    }

    const [text, onChangeText] = useState(userId);
    const [showScanner, setShowScanner] = useState(false)
    const navigation = useNavigation()

    if (showScanner == true)
        return (
            <QRScanner setShowScanner={setShowScanner} followUser={followUser} />
        )

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.replace("HomeMap")}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Wróć</Text>
            </TouchableOpacity>

            <View>
                <Text>Twój QR</Text>
            </View>


            <QRCode value={userId} />

            <TouchableOpacity
                onPress={() => setShowScanner(true)}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Skanuj QR</Text>
            </TouchableOpacity>
        </View>
    )
}

export default FollowingScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 40,
        width: 100,
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '60%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 40,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
