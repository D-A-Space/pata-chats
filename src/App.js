import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";
import uuid from "react-uuid";
import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

const appy = firebase.initializeApp({
  apiKey: "AIzaSyBPpaph0g52dKIHCveIExcPecx5V99ce34",
  authDomain: "pata-chats.firebaseapp.com",
  projectId: "pata-chats",
  storageBucket: "pata-chats.appspot.com",
  messagingSenderId: "305329005180",
  appId: "1:305329005180:web:204f10e5581ce01fac1ff9",
});
// TODO : icons api
// https://www.dicebear.com/styles/fun-emoji
const db = getFirestore(appy);
function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  // const user = firebase.auth().currentUser;
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt"),
      limit(50)
    );
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let messages = [];
      QuerySnapshot.forEach((doc) => {
        messages.push({ ...doc.data(), id: doc.id });
      });
      setMessages(messages);
    });
    return () => unsubscribe;
  }, []);
  useEffect(() => {
    const userUid =
      localStorage.getItem("userId") || localStorage.setItem("userId", uuid());
    setUserId(userUid);
  }, []);
  const sendMessage = async () => {
    const message = {
      text: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: userId,
    };
    await addDoc(collection(db, "messages"), {
      ...message,
    });
    setText("");
  };

  return (
    <div className="App">
      {!userId === "" || messages.length > 0 ? (
        messages.map((message) => (
          <div key={message.id}>
            <h3 className={`${message.uid === userId ? "text-red-600" : "text-black"}`}>{message.text}</h3>
          </div>
        ))
      ) : (
        <div>
          <h3>loading</h3>
        </div>
      )}

    
      <div className="mt-7 flex ">
        <input
          value={text}
          className="border-2"
          type="text"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />{" "}
        <button onClick={() => sendMessage()} className="p-3 bg-red-500">
          SEND
        </button>
      </div>
    </div>
  );
}

export default App;
