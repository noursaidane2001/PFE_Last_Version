import * as React from "react";
import { Grid } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { gamesapi } from "../../Data/games";
import "../Games/Games.css";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import withScrollToTop from "../withScrollToTop";
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import { Button, CardActionArea, CardActions } from '@mui/material';
import { getGames } from "../../Services/GamesService";

function Games() {
  const clientId = "2b20enpdnmnhwbor0t9lwq4pkuavg3";
  const clientSecret = "magctl9dhe7m4c2f1q7nvvffhtkrch";
  const [accessToken, setAccessToken] = useState("");
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // variable d'état pour indiquer si les données sont en cours de chargement

  useEffect(() => {
    getGames()
      .then((response) => {
        setGames(response.data.data.slice(1));
        setIsLoading(false); // indiquer que les données sont prêtes
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false); // indiquer que les données sont prêtes même si elles ont échoué
      });
  }, []);

  console.log(gamesapi.length);

  if (isLoading) {
    // si les données sont en cours de chargement, afficher un message de chargement
    return (
      <Box sx={{ display: "flex" }}>
        <CircularProgress
          style={{
            color: "black",
            marginTop: "300px",
            marginLeft: "40rem",
            position: "center",
          }}
        ></CircularProgress>
        <p style={{ color: "black", marginTop: "300px", position: "center" }}>
          Chargement en cours...
        </p>
      </Box>
    );
  }
  return (
    <Grid container direction="row" justifyContent="center" className="g1">
      {/* <Grid className="g2" spacing={4}> */}
      <div className="row">
        {games
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((game) => {
            const boxArtUrl = game.box_art_url
              .replace("{width}", "1100")
              .replace("{height}", "900");
            for (let i = 0; i < gamesapi.length; i++) {
              if (gamesapi[i].name.toLowerCase() === game.name.toLowerCase()) {
                return (
                  <div
                    className="col-lg-4 col-md-6 col-sm-12 mt-5"
                    key={game.id}
                  >
                    <div className="card">
                      <img className="card-img-top" src={boxArtUrl} alt="" />
                      <div className="card-body">
                        <h5 className="card-title">{game.name}</h5>
                        <h6 className="card-rules">{gamesapi[i].rules}</h6>
                      </div>
                    </div>
                  </div>
                );
              }
            }
          })}
        <div className="col-lg-4 col-md-6 col-sm-12 mt-5">
          <div className="card">
            <img
              className="card-img-top"
              src={"https://static-cdn.jtvnw.net/ttv-boxart/502732_IGDB-{width}x{height}.jpg"
                .replace("{width}", "300")
                .replace("{height}", "400")}
            />
            <div className="card-body">
              <h5 className="card-title">{gamesapi[21].name}</h5>
              <h6 className="card-rules">{gamesapi[21].rules}</h6>
            </div>
          </div>
        </div>
      </div>
    </Grid>
  );
}
export default withScrollToTop(Games);
