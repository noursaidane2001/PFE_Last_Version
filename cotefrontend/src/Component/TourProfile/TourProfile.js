import '../TourProfile/TourProfile.css';
import React from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from '@mui/material';
import manetteicon from '../img/manetteicon.png';
import participants from '../img/participants.png';
import calendar from '../img/calendar.png';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { format } from 'date-fns';
import YouTube from "react-youtube";
import EditTour from '../EditTour/EditTour';
import { useNavigate } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import ParticipateBtn from './Participate/ParticipateBtn';
import ChatTour from './ChatTour/ChatTour';
import io from "socket.io-client";
import { getAllTour } from '../../Services/TournamentService';


const socket = io.connect("http://localhost:5000");
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
    setSending((prevSending) => [...prevSending, 'me']);
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

function formatDate(date) {
  return format(date, 'EEEE, MMMM do yyyy, h:mm a');
}


function LabTabs() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user._id;
  const [value, setValue] = React.useState('1');
  const { id } = useParams();
  const [data, setData] = useState([]);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  useEffect(() => {
    getAllTour()
      .then((response) => {
        setData(response);
        console.log("data rendred");

      })
      .catch((error) => {
        console.log(error);
        console.log("data not found")
      });
  }, []);


  //0 pour retourner le premier élément trouver par filter dans la tab data
  const tournament = data.filter(item => item._id === id)[0];
  return (
    <Box className="b1" >
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: '#161616', width: "95vw" }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab label="Details" value="1" />
            <Tab label="Participants" value="2" />
            <Tab label="Live" value="3" />
            {tournament && tournament.idcreator && userId === tournament.idcreator?._id && (<Tab label="Settings" value="4" />)}
          </TabList>
        </Box>
        <TabPanel value="1">
          <div className='Detail'>
            {tournament && (
              <div>

                <div className='GR'>Game</div>
                <div className='G'>{tournament.jeux}</div>
                {/* <div className='R'> Tunisia-online</div> */}

                <div className='borderblack' />

                <div className='GR'>Date & Time</div>
                <div className='G'>
                  {formatDate(new Date(tournament.date))}
                </div>
                {/* <div className='R'> 11:00 PM </div> */}

                <div className='borderblack' />

                <div className='GR'>Description </div>
                <div className='R'> {tournament.description} </div>

                <div className='borderblack' />

                <div className='GR'>Join us </div>
                <a className='linkparticipate' href={tournament.link}>Go Discord </a>

                <div className='br' />
              </div>
            )}
          </div>
        </TabPanel>
        <TabPanel value="2">
          <div className='participant'>
            <h1>List of Participants</h1>
            <div className='partlist'>
              {tournament && tournament.participantid && tournament.participantid.map((user) => (
                <Link className='partt' to={`/search?user=${user._id}`}>
                  <div className='cardPartuser' key={user._id}>
                    <img src={`http://localhost:5000/uploads/user/${user.photo}`} alt="Photo de profil" />
                    <div className='card-infoP'>
                      <div className='card-info-nameP'>{user.firstname}</div>
                      <div className='card-info-lastnameP'>{user.lastname}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </TabPanel>

        <TabPanel value="3">
          {/* 2 */}
          {/* <div>
            <iframe
            width="70%"
            height="600"
            src="https://www.youtube.com/embed/zl3y8JqORvo"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write;
            encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen //it should be writen with capitals
          >
          </iframe>
          </div> */}
          {/* <div style={{ display: "inline-block" }}>
                <YouTube videoId={hello}/>
              </div> */}
          {tournament && (
            <div style={{ display: "flex", justifyContent: 'center', backgroundColor: "#161616" }}>
              <YouTube videoId={tournament.youtubelink} opts={{
                width: '769',
                height: '360',
                playerVars: {
                  autoplay: 1
                }
              }} />
              <ChatTour />
            </div>)}
        </TabPanel>
        {tournament && tournament.idcreator && userId === tournament.idcreator?._id && (
          <TabPanel value="4">
            <div className='Edit'>
              <EditTour />
            </div>
          </TabPanel>
        )}
      </TabContext>
    </Box >
  );
}
function TourProfile() {
  const { id } = useParams();
  const [data, setData] = useState([]);
  //convertion de temps
  // function convertTime(time24) {
  //   const [hours, minutes] = time24.split(':');

  //   const hours12 = hours % 12 || 12;

  //   const amPm = hours < 12 ? 'AM' : 'PM';

  //   return `${hours12}:${minutes} ${amPm}`;
  // }

  useEffect(() => {
    getAllTour()
      .then((response) => {
        setData(response);
        console.log("data rendred", response);

      })
      .catch((error) => {
        console.log(error);
        console.log("data not found")
      });
  }, []);

  const tournament = data.filter(item => item._id === id)[0];
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;

  return (
    <Grid container direction="row" justifyContent="center" className="gridblack">
      <div className="divgris" >
        {tournament && (
          <div className='tpimgbg' style={{ backgroundImage: `url(http://localhost:5000/uploads/tournament/${tournament.photo})` }}>
            <div className='title-p'>{tournament.title}</div>
            <div className='details-p'>
              <div className='jeux-p'>
                <img src={`${manetteicon}`} alt='manette' className='manette-p' />{tournament.jeux}
              </div>
              <div className='participants-p'>
                <img src={`${participants}`} alt='participants' className='particon-p' />{tournament.nbparticipants} participants
              </div>
              <div className='date-p'>
                <img src={`${calendar}`} alt='calender' className='calendar-p' />
                {new Date(tournament.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                <>  at  </>
                {new Date(tournament.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                <div className='time-p'>{tournament.Date}</div>
              </div>
              <div className='organisedCard'>
                <img src={`http://localhost:5000/uploads/user/${tournament.idcreator.photo}`} alt="Photo de profil" />
                <div className='info-organized'>
                  <div className='organized'>Organized by</div>
                  <Link className='creator' to={`/search?user=${tournament.idcreator._id}`}>
                    <div className='creatorName'>{tournament.idcreator.firstname} {tournament.idcreator.lastname}</div>
                  </Link>
                </div>
                {isAdmin ? (<></>)
                  : (<ParticipateBtn />)}
              </div>
            </div>
            <LabTabs />
          </div>
        )}


      </div>

    </Grid>





  );
}
export default TourProfile;