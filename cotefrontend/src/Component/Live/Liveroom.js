import React, { useEffect, useState } from "react";
import YouTube from 'react-youtube';
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Chat from '../testingchat/chatt';
import io from "socket.io-client";
import Avatar from '@mui/material/Avatar';
import Livereclamation from "./Liverclamation";
import ChatLive from './ChatLive/ChatLive';
import { getLive } from "../../Services/LiveService";
const socket = io.connect("http://localhost:5000");
// const user = localStorage.getItem("user");
function Chatt() {
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const utilisateur = user;
  const parsedUser = JSON.parse(localStorage.getItem("user"));
  const userId = parsedUser._id;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [time, setTime] = useState([]);
  const [sending, setSending] = useState([]);
  const [photo, setPhoto] = useState([]);

  socket.emit("join_room", { room: id });

  const sendMessage = () => {
    const createdAt = new Date();
    socket.emit("send_message", {
      message: message,
      room: id,
      sender: utilisateur,
      date: createdAt,
    });

    setMessages((prevMessages) => [...prevMessages, message]);
    setSending((prevSending) => [...prevSending, 'Me']);
    setTime((prevTime) => [...prevTime, createdAt.toString()]);
    setPhoto((prevPhoto) => [...prevPhoto, utilisateur.photo]);

    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
      setSending((prevSending) => [...prevSending, data.sender.firstname]);
      setTime((prevTime) => [...prevTime, data.date]);
      setPhoto((prevPhoto) => [...prevPhoto, data.sender.photo]);
    });

    // Nettoyer l'écouteur d'événement socket lorsque le composant est démonté
    return () => {
      socket.off("receive_message");
    };
  }, []);

  return (
    <div style={{ backgroundColor: "black" }}>
      <h3 style={{ color: "white" }}>Chat:</h3>
      <div className="horizontal-line"></div>
      <br></br>
      <div style={{ maxHeight: "300px", overflowY: "scroll" }}>
        {messages.map((msg, index) => (
          <div
            style={{
              backgroundColor: "#343beb",
              color: "white",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
            }}
            key={index}
          >
            <div>
              {photo[index] && (
                <div style={{ textIndent: '50px' }}>
                  <Avatar src={`http://localhost:5000/uploads/user/${photo[index]}`} sx={{ alignItems: 'center', marginLeft: '0px' }} />
                </div>
              )}
            </div>
            <div>
              {sending[index] && (
                <div style={{ textIndent: '50px' }}>
                  {sending[index]}
                </div>
              )}
            </div>
            {msg}
            <div style={{ marginLeft: '200px' }}>
              {time[index] && (
                <div>
                  {new Date(time[index]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <input
        placeholder="Message...."
        value={message}
        onChange={(event) => {
          setMessage(event.target.value);
        }}
      />
      <button
        onClick={sendMessage}
        style={{ backgroundColor: "#343beb", color: "white" }}
      >
        Send Message
      </button>
    </div>
  );
}

export default function Liveroom() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  useEffect(() => {
    getLive(id)
      .then((response) => {
        setData(response);
        console.log(data);
        console.log("data rendered");
      })
      .catch((error) => {
        console.log(error);
        console.log("data not found");
      });
  }, []);
  return (
    <div style={{ backgroundColor: "#000", minHeight: "70vh", paddingTop: "200px", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "769px", margin: "0 auto" }}>
        <h2 style={{ color: "white" }}>{data.title} </h2>
        <YouTube
          videoId={data.youtubelink} // Access the first item's youtubelink property
          opts={{
            width: '100%',
            height: '360',
            playerVars: {
              autoplay: 1
            }
          }}
        />
      </div>
      <div style={{ width: "450px" }}>
        <ChatLive />
      </div>

    </div>
  );
}