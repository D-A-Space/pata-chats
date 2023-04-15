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
import { generateUserIcon, randomFromArr } from "./helpers/user.icon.generator";

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
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  // const user = firebase.auth().currentUser;
  const fakeNamesArr = [
    " Kelli Spears",
    "Terrance Silva",
    "Ananda Lynn",
    "Dakotah Conti",
    "Tate Hyde",
    "Tamia Neeley",
    "Kya Shumaker",
    "Leanne Huber",
    "Kara Teague",
    "Natasha Odom",
    "Jaleel New",
    "Jonas Diggs",
    "Tiffany Paris",
    "Reina Diggs",
    "Leigha Reich",
    "Markell Pena",
    "Magaly Ayers",
    "Jenna Seibert",
    "Dillan Cates",
    "Kody Wofford",
  ];

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      orderBy("createdAt"), 
      // orderBy("createdAt", "desc"),
      // limit(50)
      // FIXME when messages over 50 it will not show the last message
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
    console.log(messages);
  }, [messages]);
  useEffect(() => {
    const userUid =
      localStorage.getItem("userId") || localStorage.setItem("userId", uuid());
    const userName =
      localStorage.getItem("userName") ||
      localStorage.setItem("userName", randomFromArr(fakeNamesArr));
    const userImage =
      localStorage.getItem("userImage") ||
      localStorage.setItem("userImage", generateUserIcon());
    setUserImage(userImage);
    setUserId(userUid);
    setUserName(userName);
  }, [messages]);
  const sendMessage = async () => {
    const message = {
      text: text,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: userId,
    image: userImage || generateUserIcon() || "",
      name: userName,
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
            <p>{message.name}</p>
            <div className={"flex gap-3 items-center"}>
              <img className="h-5 w-5" src={message.image} alt="avatar" />
              <span
                className={`${
                  message.uid === userId ? "text-red-600" : "text-black"
                }`}
              >
                {" "}
                {message.text}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div>
          <h3>loading</h3>
        </div>
      )}

      <div className="mt-7 flex ">
        <input
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }
        }
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
