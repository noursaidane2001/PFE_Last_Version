import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { Grid, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import io from "socket.io-client";
import '../Live/Live.css';
import { getAllLive } from '../../Services/LiveService';
import isLoggedin from '../isLoggedin/isLoggedin';

const socket = io.connect("http://localhost:5000");

function Live() {
  const token = localStorage.getItem("token");
  console.log("token", token);
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;
  const isLogged = isLoggedin();

  useEffect(() => {
    getAllLive()
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
    <div style={{ backgroundColor: "#161616", minHeight: "100vh", paddingTop: "0%" }}>
      <Grid container spacing={2} justifyContent="center" alignItems="center" style={{ backgroundColor: "#161616" }}>
        <Grid item xs={12} sm={2}>
          <Button
            variant="contained"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            style={{ color: "#343beb" }}
          >
            Previous
          </Button>
        </Grid>
        <Grid item xs={12} sm={8} style={{ textAlign: 'center', marginTop: "8%" }}>
          {data.length > 0 && (
            <>
              <Typography variant="h5" style={{ color: "#ffffff", marginBottom: "1rem" }}>
                {data[currentIndex].title}
              </Typography>
              <div className="youtube-container">
                <YouTube videoId={data[currentIndex].youtubelink} opts={{
                  width: '769',
                  height: '360',
                  playerVars: {
                    autoplay: 0
                  }
                }} />
              </div>
              <Typography variant="body1" style={{ color: "#ffffff", marginTop: "1rem", marginLeft: "2rem" }}>
                Game: {data[currentIndex].jeux}
              </Typography>
            </>
          )}
          {isLogged && isAdmin ? null : (
            <>
              {isLogged && !isAdmin ? (
                <Button
                  variant="contained"
                  onClick={handleLiveroom}
                  // disabled={currentIndex === 0}
                  style={{ color: "#343beb", marginTop: "2rem", marginLeft: "3rem" }}
                >
                  Join the live
                </Button>

              ) : null}
            </>
          )}


        </Grid>
        <Grid item xs={12} sm={2} style={{ textAlign: 'right' }}>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={currentIndex === data.length - 1}
            style={{ color: "#343beb" }}
          >
            Next
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default Live;