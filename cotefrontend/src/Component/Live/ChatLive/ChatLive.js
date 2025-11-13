import React from 'react';
import { useParams } from 'react-router-dom';
import { FilledInput, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Avatar from '@mui/material/Avatar';
import io from "socket.io-client";
import SendIcon from '@mui/icons-material/Send';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './ChatLive.css'

const socket = io.connect("http://localhost:5000");
function ChatLive() {
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
    <div  className="Chatbig">
      <h3 className="chatTitle2">Chat:</h3>
      <div className="chatContainer2">
        <div className="horizontalLine"></div>
        <div className="chatMessagesContainer">
          <div className="chatMessages">
            {messages.map((msg, index) => (
              <div key={index} className="messageContent2">
                <div>
                  {photo[index] && (
                    <div className="senderContainer2">
                      <Avatar
                        src={`http://localhost:5000/uploads/user/${photo[index]}`}
                        sx={{ alignItems: 'center', marginLeft: '0px' }}
                      />
                      {sending[index] && (
                        <div className="sendingMessage">
                          {sending[index]}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <div className='messagecss'>{msg}</div>
                <div className="messageTime">
                  {time[index] && new Date(time[index]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div >
        <FilledInput
          placeholder="Message...."
          value={message}
          variant="outlined"
          fullWidth
          onChange={(event) => {
            setMessage(event.target.value);
          }}
          sx={{ width: "25rem", color: "white" }}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={sendMessage}
                //onMouseDown={handleMouseDownPassword}
                edge="end"
              >
                <SendIcon style={{ color: "#343beb" }} />
              </IconButton>
            </InputAdornment>
          }
        >
        </FilledInput>

      </div>

    </div>

  );
}
export default ChatLive;