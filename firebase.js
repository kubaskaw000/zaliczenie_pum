// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDg1bmhJj28xsP3fbiErSc7UJrmXTeVGf4",
  authDomain: "fir-auth-48eda.firebaseapp.com",
  projectId: "fir-auth-48eda",
  storageBucket: "fir-auth-48eda.appspot.com",
  messagingSenderId: "572098073441",
  appId: "1:572098073441:web:1c9cc903da1e47c1daeb20"
};

// Initialize Firebase
let app;

app = firebase.initializeApp(firebaseConfig)

const auth = firebase.auth()

export { auth };