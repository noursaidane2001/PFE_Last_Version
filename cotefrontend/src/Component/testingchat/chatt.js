import React, { useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io.connect("http://localhost:5000");
export default function Chatt() {
  const [message, setMessage] = useState("");
  const [messageReceived, setMessageReceived] = useState("");
  const [messages, setMessages] = useState([]);
  const sendMessage = () => {
    socket.emit("send_message", { message: message });
    setMessages((prevMessages) => [...prevMessages, message]);
    setMessage("");
  };
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceived(data.message);
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });
    // Clean up the socket event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, []);
  return (
    <div style={{ marginTop: "2px" }}>
      <h3 style={{ color: "white" }}>Messages:</h3>
      <ul>
        {messages.map((msg, index) => (
          <li style={{ color: "white" }} key={index}>{msg}</li>
        ))}
      </ul>
      <input
        placeholder="Message...."
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button onClick={sendMessage}>Send Message</button>
    </div>
  );
}
