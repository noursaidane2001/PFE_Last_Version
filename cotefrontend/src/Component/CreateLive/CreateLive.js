import * as React from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import "../CreateTournement/CreateTournement.css";
import { useNavigate, NavLink } from "react-router-dom";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import ImageUploading from "react-images-uploading";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { isBefore } from "date-fns";
import { gamesapi } from "../../Data/games";
import { createLive } from "../../Services/LiveService";

function CreateLive(props) {
  const { width } = props;
  /**games contient les noms des games récuperer par l'api de twitch **/
  const clientId = "2b20enpdnmnhwbor0t9lwq4pkuavg3";
  const clientSecret = "magctl9dhe7m4c2f1q7nvvffhtkrch";
  const [games, setGames] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  // const [Jeux, setJeux] = useState();

  useEffect(() => {
    //code pour récuperer le tocken d'authentification
    axios
      .post("https://id.twitch.tv/oauth2/token", {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: "client_credentials",
      })
      .then((response) => {
        const token = response.data.access_token;
        setAccessToken(token);
        console.log(accessToken);

        axios
          .get("https://api.twitch.tv/helix/games/top", {
            headers: {
              "Client-ID": "2b20enpdnmnhwbor0t9lwq4pkuavg3",
              Authorization: `Bearer ${token}`,
            },
            params: {
              first: 50, // le nombre de jeux à récupérer (maximum 100)
            },
          })
          .then((response) => {
            setGames(response.data.data.slice(1));
            console.log(games);
            console.log(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  /*fin de consultation de l'api de twitch*/
  /*****alert mui*****/
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  /*****alert mui*****/
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [values, setValues] = React.useState({
    title: "",
    jeux: "",
    youtubelink: "",
  });
  // const[photo,setPhoto] = React.useState(null);
  const validateForm = (values) => {
    const error = {};
    if (!values.title) {
      error.title = "Title is required";
    }
    if (!values.jeux) {
      error.jeux = "Game is required";
    }
    if (!values.youtubelink) {
      error.youtubelink = "Youtube video link is required";
    } else if (
      !/^https?:\/\/(?:www\.)?youtube.com\/watch\?(?=.*v=\w+).*$/.test(
        values.youtubelink
      )
    ) {
      error.youtubelink = "Youtube Link incorrect";
    }
    return error;
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues({
      ...values,
      [name]: value,
    });
  };
  const handleJeuxChange = (e, newValue) => {
    setValues({
      ...values,
      jeux: newValue,
    });
  };
  const handleclick = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(values));
    setIsSubmit(true);
  };
  const token = localStorage.getItem("token");
  console.log("token", token);
  /***envoi des données par axios***/
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const post = {
        title: values.title,
        jeux: values.jeux,
        youtubelink: values.youtubelink.match(/(?<=v=)[\w-]+/)[0],
      };
      console.log(post);
      createLive(post, token)
        .then((response) => {
          const liveId = response.Live._id;
          console.log("reussit", response);
          navigate(`/live/${liveId}`, { replace: true });
        })
        .catch((error) => {
          if (error.message === "The YouTube video is not live now") {
            console.log("The YouTube video is not live now");
            Swal.fire({
              title: "The YouTube video is not live now",
              icon: "error",
              showCancelButton: false,
            });
          }
          if (error.message === "The YouTube video link is invalid") {
            console.log("The YouTube video link is invalid");
            Swal.fire({
              title: "The YouTube video link is invalid",
              icon: "error",
              showCancelButton: false,
            });
          }
        });
    }
  }, [formErrors]);

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{
        width: "100%",
        height: "89vh",
        backgroundColor: "#161616",
        marginTop: "4%",
      }}
    >
      <CssBaseline />
      <Grid container direction="column" spacing={2} sx={{ width: "50%" }}>
        <Grid item>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h1
              style={{
                marginTop: "-3rem",
                color: "#FFFFFF",
                fontFamily: "Mulish, sans-serif",
                fontWeight: 200,
                fontSize: 60,
                letterSpacing: "2px",
              }}
            >
              Start a live stream
            </h1>
          </div>
        </Grid>
      </Grid>

      {/*****************formulaire****************/}
      {/* title */}
      <FormControl
        required
        sx={{ m: 1, width: "52ch", marginTop: "1rem" }}
        variant="outlined"
      >
        <InputLabel htmlFor="name" style={{ color: "rgb(159, 156, 156)" }}>
          Title
        </InputLabel>
        <OutlinedInput
          name="title"
          onChange={handleChange}
          value={values.title}
          id="title"
          label="Title"
          sx={{
            "& fieldset": {
              borderColor: "#FFFFFF80",
            },
          }}
          style={{ color: "#ffffff" }}
        />
        <Stack spacing={2} sx={{ width: "100%" }}>
          {formErrors.title && (
            <Alert severity="error">{formErrors.title}</Alert>
          )}
        </Stack>
      </FormControl>

      {/* jeux */}
      <FormControl sx={{ m: 1, width: "52ch" }}>
        <Autocomplete
          name="jeux"
          id="jeux"
          onChange={handleJeuxChange}
          value={values.jeux}
          options={[...gamesapi.map((game) => game.name)].sort((a, b) =>
            a.localeCompare(b)
          )}
          sx={{ width: "52ch" }}
          renderInput={(params) => (
            <TextField {...params} label="Game" required />
          )}
          isOptionEqualToValue={(option, value) =>
            option.toLowerCase() === value.toLowerCase()
          }
        />
        <Stack spacing={2} sx={{ width: "100%" }}>
          {formErrors.jeux && <Alert severity="error">{formErrors.jeux}</Alert>}
        </Stack>
      </FormControl>

      {/* Youtube link */}
      <FormControl required sx={{ m: 1, width: "52ch" }} variant="outlined">
        <InputLabel htmlFor="name" style={{ color: "rgb(159, 156, 156)" }}>
          Youtube Link
        </InputLabel>
        <OutlinedInput
          name="youtubelink"
          onChange={handleChange}
          value={values.youtubelink}
          id="youtubelink"
          label="Youtube link"
          sx={{
            "& fieldset": {
              borderColor: "#FFFFFF80",
            },
          }}
          style={{ color: "#ffffff" }}
        />
        <Stack spacing={2} sx={{ width: "100%" }}>
          {formErrors.youtubelink && (
            <Alert severity="error">{formErrors.youtubelink}</Alert>
          )}
        </Stack>
      </FormControl>

      {/* button */}
      <Button
        name="button"
        type="submit"
        onClick={handleclick}
        style={{
          backgroundColor: "#343beb",
          borderRadius: "50px",
          letterSpacing: "3px",
          marginTop: "4rem",
          width: "200px",
        }}
      >
        Create
      </Button>
    </Grid>
  );
}

export default CreateLive;
