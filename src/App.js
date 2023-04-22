import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/analytics";
import uuid from "react-uuid";
import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  getDoc,
  getDocs,
  getFirestore,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { generateUserIcon } from "./helpers/user.icon.generator";
import SentBubble from "./components/SentBubble";
import { RecievedBubble } from "./components/RecievedBubble";
import { scrollTranscriptWindow } from "./helpers/scroll";
import { filterProfanity } from "./helpers/helpers";

// SECTION Bad words filter Function

const appy = firebase.initializeApp({
  apiKey: "AIzaSyBPpaph0g52dKIHCveIExcPecx5V99ce34",
  authDomain: "pata-chats.firebaseapp.com",
  projectId: "pata-chats",
  storageBucket: "pata-chats.appspot.com",
  messagingSenderId: "305329005180",
  appId: "1:305329005180:web:204f10e5581ce01fac1ff9",
});

const db = getFirestore(appy);

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");
  const [userImage, setUserImage] = useState("");
  const [userName, setUserName] = useState("");
  const [isUser, setIsUser] = useState(false);
  const [room, setRoom] = useState("");
  const [noRoom, setNoRoom] = useState(true);

  const [spamCount, setSpamCount] = useState(0);
  const [spam, setSpam] = useState(false);
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  useEffect(() => {
    if (spamCount > 0 && !spam) {
      const interval = setInterval(() => {
        setSpamCount((prev) => prev - 1);
      }, 3000);
      return () => clearInterval(interval);
    } else if (spamCount > 0 && spam) {
      const interval = setInterval(() => {
        setSpamCount((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [spamCount, spam]);

  useEffect(()=>{
    if(room && room.trim() !== '' && room.length > 0){

      window.document.title = `Pata Chats - ${room.replace("_"," ")}`
    }
  },[room])

  useEffect(() => {
    if (spamCount > 4 && !spam) {
      setSpamCount(10);
      setSpam(true);
    } else if (spamCount === 0 && spam) {
      setSpam(false);
    }
  }, [spamCount]);

  const params = new URLSearchParams(window.location.search);
  useEffect(() => {
    setLoading(true);
    if (params) {
      setRoom(params.get("room"));
      if (params.get("room") && params.get("room").length > 0) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const user = localStorage.getItem("userName");

    if (user) {
      setIsUser(true);
    } else {
      setIsUser(false);
    }
  }, []);

  // FIXME spam , fake msgs
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
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (room) {
      const q = query(
        collection(db, room),
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
    }
  }, [room]);
  const welcomeMessage = () => {
    return {
      text: `Welcome to ${room
        .replace("_", " ")
        } Hub Have a nice day`,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: "BOT",
      image: generateUserIcon(),
      name: `${room.replace("_", " ")} BOT`,
    };
  };

  useEffect(() => {
    const userUid =
      localStorage.getItem("userId") || localStorage.setItem("userId", uuid());
    const userName = localStorage.getItem("userName");
    const userImage =
      localStorage.getItem("userImage") ||
      localStorage.setItem("userImage", generateUserIcon());
    setUserImage(userImage);
    setUserId(userUid);
    setUserName(userName);
  }, [messages]);
  const sendMessage = async () => {
    const message = {
      text: filterProfanity(text.trim()),
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: userId,
      image: userImage || generateUserIcon() || "",
      name: userName,
    };
    await addDoc(collection(db, room), {
      ...message,
    });
    setLoading(false);
    setText("");
  };

  useEffect(() => {
    scrollTranscriptWindow();
  }, [messages]);

  const handleSendMessage = () => {
    if (loading) return;
    setLoading(true);
    if (text.trim() !== "") {
      if (text.length > 100) {
        setLoading(false);
        return alert("Too many letters");
      }
      if (spam) {
        setLoading(false);
        return;
      }
      sendMessage();
      setSpamCount((prev) => prev + 1);
      textareaRef?.current.focus();
    }
  };

  // Get the input field element
  var textarea = document.getElementById("myInput");

  // Add an event listener for input changes
  textarea?.addEventListener("input", function () {
    // Reset the height to auto to recalculate the actual height
    textarea.style.height = "auto";

    // Calculate the height of the textarea based on the size of the text
    var textHeight = textarea.scrollHeight;

    // Set the height of the textarea
    textarea.style.height = textHeight + "px";
  });

  useEffect(() => {
    setTimeout(() => {
      setDone(true);
    }, 3000);
  }, []);
  useEffect(() => {
    if (done) {
      const welcome = welcomeMessage();
      setMessages([...messages, welcome]);
      setDone(false);
    }
  }, [done]);
  return (
    <>
      {room && room.length > 0 && (
        <>
          {isUser ? (
            <div
              style={{ background: "linear-gradient(#0007, #0000), #123" }}
              className="flex flex-col h-screen w-screen pb-10"
            >
              <div className=" h-16  backdrop-blur-lg font-bold text-white sticky  right-0 left-0 top-0  capitalize rounded-b-lg flex items-center justify-center shadow-xl shadow-violet-200/20">
                {room?.replace("_", " ")} chatroom
              </div>
              <div
                id="chat"
                className=" flex flex-col gap-7 p-5 overflow-y-auto flex-1"
              >
                {!userId === "" || messages.length > 0 ? (
                  messages.map((message, i) =>
                    message.uid === userId ? (
                      <div className="self-end" key={i}>
                        <SentBubble
                          text={message.text}
                          image={message.image}
                          name={message.name}
                        />
                      </div>
                    ) : (
                      <div className="self-start" key={i}>
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

              <div className=" max-h-[33%] px-2 pt-3 space-y-2">
                {spam && (
                  <p className="text-sm text-red-500">
                    Slow down there, you can send a new message in {spamCount}{" "}
                    seconds
                  </p>
                )}
                <div className="flex gap-2 justify-center items-center">
                  <textarea
                    ref={textareaRef}
                    id="myInput"
                    placeholder="Write a message..."
                    tabIndex={0}
                    dir="auto"
                    value={text}
                    className="border-2 h-full break-words border-neutral-500 w-full p-3 rounded-xl bg-slate-700/50 text-white max-h-[200px] overflow-y-hidden resize-none"
                    rows={1}
                    type="text"
                    maxLength={100}
                    onChange={(e) => {
                      setText(e.target.value);
                    }}
                  >
                    {" "}
                  </textarea>
                  <button
                    onClick={handleSendMessage}
                    disabled={text.trim() === ""}
                    className="p-3 rounded-full bg-violet-500 shadow-md shadow-neutral-700 active:shadow-none disabled:bg-neutral-300 disabled:shadow-none"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-send-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />{" "}
                    </svg>
                  </button>
                </div>
                <div className="flex justify-between  px-2">
                  <span className="text-neutral-500 text-sm">
                    Made with 💜 by DNA{" "}
                  </span>
                  <span className="text-neutral-500 text-sm">
                    Send as {userName}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{ background: "linear-gradient(#0007, #0000), #123" }}
              className="flex justify-center items-center h-screen w-screen pb-10"
            >
              <div className="bg-white opacity-70 shadow-lg shadow-white/25 flex flex-col justify-center gap-3 w-2/3 rounded-lg p-5">
                <p className="font-bold">Choose a username:</p>
                <input
                  type="text"
                  maxLength={15}
                  className="border border-neutral-600 rounded p-2 bg-[#123]/25 placeholder:text-gray-700"
                  placeholder="Dreaming Owl"
                  onChange={(e) => {
                    setUserName(e.target.value);
                    localStorage.setItem("userName", e.target.value);
                  }}
                />
                <button
                  className="bg-[#123] text-white p-2 disabled:opacity-50"
                  onClick={() => window.location.reload()}
                  disabled={!userName?.length || userName?.length < 3}
                >
                  Enter Room
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default App;
