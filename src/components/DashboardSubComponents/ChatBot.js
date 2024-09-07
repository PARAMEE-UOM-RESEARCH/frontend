import axios from "axios";
import React, { useEffect, useState } from "react";
import { Widget, addResponseMessage, addUserMessage } from "react-chat-widget";
import "react-chat-widget/lib/styles.css";
const { REACT_APP_BASE_URL } = process.env;

const ChatBot = ({ isDeleted, setIsDeleted = () => {}, profile }) => {
  const [message, setMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    (async () => {
      await axios
        .get(`${REACT_APP_BASE_URL}/chat/${profile.id}`)
        .then((res) =>
          res.data.map((el) => {
            addUserMessage(el.user);
            addResponseMessage(el.assistant);
          })
        )
        .catch((err) => alert(err));
      addResponseMessage("**Welcome Chief to this awesome chat!**");
    })();
    setIsDeleted(false);
  }, []);

  useEffect(() => {
    if (isDeleted) {
      window.location.reload();
      setIsDeleted(false);
    }
  }, [isDeleted]);

  const handleNewUserMessage = async (newMessage) => {
    await axios
      .post(
        `${REACT_APP_BASE_URL}/chat/`,
        {
          userId: profile.id,
          userName: profile.name,
          text: newMessage,
        },
      )
      .then((res) => addResponseMessage(res.data))
      .catch((err) => alert(err));
  };
  return (
    <div className="App">
      <Widget
        handleNewUserMessage={handleNewUserMessage}
        profileAvatar={"https://i.ibb.co/2WH8sKP/bot.png"}
        profileClientAvatar={"https://flowbite.com/docs/images/logo.svg"}
        title="My Chat Assistant"
        subtitle="InstaStay Hotel Management System"
        // titleAvatar={"https://flowbite.com/docs/images/logo.svg"}
        resizable={true}
        markAllAsRead
        showBadge={false}
        emojis={false}
        launcherOpenImg={"https://i.ibb.co/2WH8sKP/bot.png"}
        launcherCloseImg={"https://i.ibb.co/8B4kGnB/close.png"}
      />
    </div>
  );
};

export default ChatBot;
