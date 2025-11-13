import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import './ChatHistTour.css';
import { Link } from 'react-router-dom';
function ChatHistTour() {
  const token = localStorage.getItem("token");
  console.log("token", token);
  const { id } = useParams();
  console.log("hello from useparams", id);
    const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:5000/chat/tournamentchat/${id}`)
      .then((response) => {
        setData(response.data);
        console.log(data);
        console.log("data rendered");
      })
      .catch((error) => {
        console.log(error);
        console.log("data not found");
      });
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex < data.length) {
        return newIndex;
      } else {
        return prevIndex;
      }
    });
  };

  const handleLiveroom = () => {
    const liveId = data[currentIndex]._id;
    navigate(`/live/${liveId}`);
    // socket.emit("join_room", { room: liveId });
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex - 1;
      if (newIndex >= 0) {
        return newIndex;
      } else {
        return prevIndex;
      }
    });
  };

  return (
    <div className="Chatbig1">
      <h3 className="chatTitle">Chat:</h3>
      <div className="chatContainer1">
        <div className="horizontalLine"></div>
        <div className="chatMessagesContainer">
          <div className="chatMessages">
            {data.map((msg, index) => (
              <div key={index} className="messageContent1">
                <div>
                  {msg.idsender.photo && (
                    <div className="senderContainer1">
                      <Avatar
                        src={`http://localhost:5000/uploads/user/${msg.idsender.photo}`}
                        sx={{ alignItems: 'center', marginLeft: '0px' }}
                      />
                      {msg.idsender.firstname && (
                        <Link className='partt' to={`/search?user=${msg.idsender._id}`}>
                        <div className="sendingMessage1">
                          {msg.idsender.firstname}
                        </div>
                        </Link>
                      )}
                    </div>
                  )}
                </div>
                <div className='messagecss1'>{msg.message}</div>
                <div className="messageTime1">
                  {msg.created_At && new Date(msg.created_At).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatHistTour;
