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
import SentBubble from "./components/SentBubble";
import { RecievedBubble } from "./components/RecievedBubble";
import { scrollTranscriptWindow } from "./helpers/scroll";

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
      orderBy("createdAt")
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

  useEffect(() => {
    scrollTranscriptWindow();
  }, [messages]);

  return (
    <div
      style={{ background: "linear-gradient(#0007, #0000), #123" }}
      className="grid grid-cols-1 grid-rows-7 h-screen w-screen pb-10"
    >
      <div
        id="chat"
        className="row-span-6 flex flex-col gap-7 p-5 overflow-y-auto"
      >
        {!userId === "" || messages.length > 0 ? (
          messages.map((message) =>
            message.uid === userId ? (
              <div className="self-end" key={message.id}>
                <SentBubble
                  text={message.text}
                  image={message.image}
                  name={message.name}
                />
              </div>
            ) : (
              <div className="self-start" key={message.id}>
                <RecievedBubble
                  text={message.text}
                  image={message.image}
                  name={message.name}
                />
              </div>
            )
          )
        ) : (
          <div>
            <h3>loading</h3>
          </div>
        )}
      </div>

      <div className="relative row-sapn-1 px-2 pt-3 flex gap-2 justify-center items-center">
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          value={text}
          className="border-2 border-neutral-500 w-8/12 p-3 rounded-full bg-slate-700/50 text-white"
          type="text"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />{" "}
        <button
          onClick={() => {
            if (text.trim() !== "") {
              if (text.length > 50) {
                return alert("too many letters");
              }
              sendMessage();
            }
          }}
          disabled={text.trim() === ""}
          className="p-3 rounded-full bg-violet-500 shadow-md shadow-neutral-700 active:shadow-none disabled:grayscale disabled:shadow-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            class="bi bi-send-fill"
            viewBox="0 0 16 16"
          >
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />{" "}
          </svg>
        </button>
        <span className="absolute -bottom-5 text-neutral-500 text-sm">
          Send as {userName}
        </span>
      </div>
    </div>
  );
}

export default App;
