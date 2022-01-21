import React, { useState, useCallback, useEffect } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { db } from '../firebase'
import firebase from 'firebase/compat/app';


const saveMessage = (sender_id, receiver_id, date, message) => {

    db.collection('messages').doc("messages").update({
        messages: firebase.firestore.FieldValue.arrayUnion({
            data: date,
            message: message,
            receiver_id: receiver_id,
            sender_id: sender_id
        })
    });
}

const getMessages = async (sender_id, receiver_id) => {

    const messages = await db.collection('messages').get()

    messages.docs.map(doc => console.log(doc.data())).where;


    //console.log(messages)



    //return doc.data()

}

const Example = (props) => {

    console.log("sender " + props.route.params.sender_id)
    console.log("receiver " + props.route.params.receiver_id)

    const senderId = props.route.params.sender_id;
    const receiverId = props.route.params.receiver_id;

    const navigation = useNavigation()

    const [messages, setMessages] = useState([]);

    useEffect(() => {

        getMessages(senderId, receiverId)
            .then(function (result) {
                console.log(result)

            })

        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        ])

    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        console.log(messages[0].text) // wiadomosc

        let date = new Date()
        saveMessage(senderId, receiverId, date, messages[0].text)

    }, [])


    return (
        <>

            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.replace("HomeMap")}
                >
                    <Text>Press Here</Text>
                </TouchableOpacity>
            </View>

            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: 1,
                }}
            />
        </>
    )
}
const styles = StyleSheet.create({
    container: {
        top: 30,
        left: 50,
        width: 50,
        height: 100,
        justifyContent: "center",
        backgroundColor: "red"
    },
    returnButton: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor: '#0782F9',
        width: 50,
        height: 30,
    },
});

export default Example