import { useNavigation } from '@react-navigation/native'
import { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, TextInput } from 'react-native'
import { auth, db } from '../firebase'
import firebase from 'firebase/compat/app';

const followUser = (userId, followerId) => {
    //console.log(followerId)
    //console.log(user.uid)
    db.collection('followers').doc(userId).update({
        following: firebase.firestore.FieldValue.arrayUnion(followerId)
    });

}

const FollowingScreen = () => {

    const userId = auth.currentUser.uid

    const [text, onChangeText] = useState(userId);
    const navigation = useNavigation()

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.replace("HomeMap")}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Wróć</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => {
                    followUser(userId, text)
                    console.log(text)
                }}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Followuj</Text>
            </TouchableOpacity>

            <SafeAreaView>
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                />
            </SafeAreaView>
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
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
})
