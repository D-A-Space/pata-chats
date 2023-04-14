
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';
firebase.initializeApp({
    apiKey: "AIzaSyBPpaph0g52dKIHCveIExcPecx5V99ce34",
  authDomain: "pata-chats.firebaseapp.com",
  projectId: "pata-chats",
  storageBucket: "pata-chats.appspot.com",
  messagingSenderId: "305329005180",
  appId: "1:305329005180:web:204f10e5581ce01fac1ff9"
})
const auth = firebase.auth();
const firestore = firebase.firestore();
const analytics = firebase.analytics();
function App() {
    const [user] = useAuthState(auth);

  return (
    <div className="App">
   <div className="text-5xl text-red-500 text-center">hi</div>
    </div>
  )
}

export default App;
