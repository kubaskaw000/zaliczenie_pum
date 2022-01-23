import React, { useState, useEffect, useRef } from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'
import * as Location from 'expo-location';
import { auth, db } from '../firebase'
import Constants from 'expo-constants';
import firebase from 'firebase/compat/app';
import { GiftedChat } from 'react-native-gifted-chat'
import { doc } from 'firebase/firestore';


export default function HomeMap() {

    const userId = auth.currentUser.uid;

    console.log(userId)
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [followersLocation, setFollowersLocation] = useState([])
    const subscription = useRef(null)


    const [messages, setMessages] = useState([]);

    const setUserLocation = async (userId) => {

        try {
            if (Platform.OS === 'android' && !Constants.isDevice) {
                setErrorMsg(
                    'Oops, this will not work on Snack in an Android emulator. Try it on your device!'
                );
                return;
            }
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            subscription.current = await Location.watchPositionAsync({ accuracy: Location.Accuracy.Highest, distanceInterval: 0 }, (loc) => {

                setLocation(loc)
                const locations = db.collection('locations').doc(userId);
                locations.set({
                    uid: userId, location: { coords: { latitude: loc.coords.latitude, longitude: loc.coords.longitude } }
                });
            });

        } catch (err) {
            alert(err)
        }
    }

    const getUserFollows = async (userId) => {
        const userFollows = db.collection('followers').doc(userId);

        const doc = await userFollows.get()

        return doc.data()
    }

    const followUser = (followerId) => {

        //console.log(followerId)
        //console.log(userId)
        db.collection('followers').doc(userId).update({
            following: firebase.firestore.FieldValue.arrayUnion(followerId)
        });
    }

    const getUserLocation = async (followerId) => {

        const userLocation = db.collection('locations').doc(followerId);
        const doc = await userLocation.get();
        //console.log("data + " + doc.data())

        return doc.data()

    }

    const getFollowersLocations = async (userId) => {

        let followers = await getUserFollows(userId)

        let locations = []

        //console.log(followers.following.length);

        for (let i = 0; i < followers.following.length; i++) {
            console.log(followers.following[i]);

            let location = await getUserLocation(followers.following[i])

            if (location) locations.push(location)
        }

        return locations;
    }

    useEffect(() => {

        getFollowersLocations(userId)
            .then(function (result) {
                setFollowersLocation(result)
                //console.log(result)

            })

        setUserLocation(userId);



        //followUser("VUB8ezWqTXPrAuioMHKsir8XmZB2")

        // getUserFollows(userId)
        //     .then(function (result) {

        //         alert(JSON.stringify(result))
        //     })


        // getUsersLocations()
        //     .then(function (result) {
        //         alert(result)
        //     })


        return () => {
            subscription.current?.remove();
        }


    }, []);

    const navigation = useNavigation()

    const handleSignOut = () => {
        auth
            .signOut()
            .then(() => {
                navigation.replace("Login")
            })
            .catch(error => alert(error.message))
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={handleSignOut}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Sign out</Text>
            </TouchableOpacity>


            <TouchableOpacity
                onPress={() => navigation.replace("FollowingScreen")}
                style={styles.buttonFollowers}
            >
                <Text style={styles.buttonText}>follows</Text>
            </TouchableOpacity>

            <MapView style={styles.map} >

                {followersLocation.map(({ location }, i) =>

                    <MapView.Marker
                        key={i}
                        title={followersLocation[i].uid ?? "brak"}
                        description="Web Design and Development"
                        coordinate={{
                            "latitude": location?.coords.latitude ?? 35, "longitude": location?.coords.longitude ?? 22.52
                        }}
                        onPress={() => {
                            //console.log(userId, followersLocation[i].uid)
                            navigation.replace("Chat", {
                                sender_id: userId,
                                receiver_id: followersLocation[i].uid,
                            })
                        }
                        }

                    />
                )}

            </MapView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "relative",
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },


    map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    button: {
        position: "absolute",
        width: 100,
        height: 100,
        top: 50,
        left: 200,
        zIndex: 10
    },
    buttonFollowers: {
        position: "absolute",
        width: 100,
        height: 100,
        top: 50,
        left: 50,
        zIndex: 10
    },
    buttonText: {
        position: 'absolute',
        backgroundColor: 'red',
        color: 'white',
        fontWeight: '700',
        fontSize: 30,
    },
});