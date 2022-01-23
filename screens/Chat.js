import React, { useState, useCallback, useEffect, useRef } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native'
import { CurrentRenderContext, useNavigation } from '@react-navigation/native'
import { db } from '../firebase'
import firebase from 'firebase/compat/app';

// data: date,
//     message: message,
//         receiver_id: receiver_id,
//             sender_id: sender_id

const updateMessageInteval = 10 * 1000

const saveMessage = (conversation_id, sender_id, date, message) => {
    db.collection('chat').doc(conversation_id)
        .collection('messages').add({
            sender_id: sender_id,
            date: date,
            message: message
        })
}

const getConversationId = async (sender_id, receiver_id) => {

    const chat = db.collection('chat');

    const snapshot = await chat.where('users', 'in', [[sender_id, receiver_id], [receiver_id, sender_id]]).get();

    if (snapshot.docs.length == 0) {
        const conversation = await db.collection('chat').add({
            users: [sender_id, receiver_id]
        })

        return conversation.id
    }

    return snapshot.docs[0].id
}

const getMessages = async (conversation_id) => {

    let messages = []

    const chat = db.collection('chat')

    const snapshot = await chat.doc(conversation_id).collection('messages').orderBy('date', 'desc').get()

    snapshot.forEach((doc) => {

        const message = doc.data()

        console.log(message.date)

        messages.push(
            {
                _id: doc.id,
                text: message.message,
                createdAt: message.date.toDate(),
                user: {
                    _id: message.sender_id,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
        )
    })


    return messages

}

const Chat = (props) => {

    const conv_id = useRef(null)
    const updateMessageIntevalId = useRef(null)

    console.log("sender " + props.route.params.sender_id)
    console.log("receiver " + props.route.params.receiver_id)

    const senderId = props.route.params.sender_id;
    const receiverId = props.route.params.receiver_id;

    const navigation = useNavigation()

    const [messages, setMessages] = useState([]);

    const updateMessages = (convId) => {
        getMessages(convId).then((data) => setMessages(data))
    }

    useEffect(() => {

        getConversationId(senderId, receiverId)
            .then(function (result) {
                conv_id.current = result

                getMessages(result)
                    .then(function (data) {

                        setMessages(data)
                        updateMessageIntevalId.current = setInterval(() => updateMessages(result), updateMessageInteval)
                    })

            })

        return () => clearInterval(updateMessageIntevalId.current)

    }, [])

    const onSend = useCallback((messages = []) => {
        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        let date = new Date()
        saveMessage(conv_id.current, senderId, date, messages[0].text)

    }, [])

    return (
        <>

            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.replace("HomeMap")}
                >
                    <Text>Back</Text>
                </TouchableOpacity>
            </View>

            <GiftedChat
                messages={messages}
                onSend={messages => onSend(messages)}
                user={{
                    _id: senderId,
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

    },
    returnButton: {
        width: 50,
        height: 50,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#0782F9',
        width: 50,
        height: 30,
    },
});

export default Chat