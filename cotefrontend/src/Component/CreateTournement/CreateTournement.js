import * as React from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import "./CreateTournement.css";
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
import { CreateTour } from "../../Services/TournamentService";
import { getGames } from "../../Services/GamesService";

function CreateTournement(props) {
  const { width } = props;
  const [isLoading, setIsLoading] = useState(false);

  /*****alert mui*****/
  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });
  /*****alert mui*****/
  // récupère la date et l'heure actuelles
  const now = new Date();
  console.log(now);
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [values, setValues] = React.useState({
    title: "",
    jeux: "",
    nbparticipants: "",
    date: "",
    link: "",
    youtubelink: "",
    description: "",
  });
  const validateForm = (values) => {
    const error = {};
    if (!values.title) {
      error.title = "Title is required";
    }

    if (!values.jeux) {
      error.jeux = "Game is required";
    }

    if (!values.nbparticipants) {
      error.nbparticipants = "Number of max participants is required";
    } else if (!/^[1-9]\d*$/.test(values.nbparticipants)) {
      error.nbparticipants = "Please enter a positive integer";
    }
    if (!values.date) {
      error.date = "Date is required";
    } else if (isBefore(new Date(values.date), now)) {
      error.date = "Passed date";
    }

    if (!values.link) {
      error.link = "Discord link is required";
    } else if (!/^https?:\/\/discord\.gg\/[a-zA-Z0-9]+$/.test(values.link)) {
      error.link = "Discord Link incorrect";
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
    if (!values.description) {
      error.description = "description is required";
    }
    return error;
  };
  const [maxParticipantsError, setMaxParticipantsError] = useState("");

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

  console.log(values.date);

  const handleclick = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(values));
    setIsSubmit(true);
  };

  // image
  const [image, setImage] = React.useState(null);
  console.log("here is image", image);
  const maxNumber = 1;
  const onChange = (imageList) => {
    // data for submit
    setImage(imageList[0]);
    console.log(imageList, 12);
    console.log("here is image", image);
  };

  //get token from localstorage
  const token = localStorage.getItem("token");
  console.log("token", token);
  //   const [gameURL, setgameURL] = useState('');
  //   const [gameDescription, setgameDescription] = useState('');
  //   const [games, setGames] = useState([]);
  //   useEffect(() => {
  //     getGames()
  //       .then(response => {
  //         setGames(response.data.data.slice(1));
  //       })
  //       .catch(error => {
  //         console.log(error);
  //       });
  //       const selectedGame = games.find(item => item.name === values.jeux);

  //       if (selectedGame) {
  //         setgameURL(selectedGame.box_art_url);

  //       }
  //   }, []);
  //   useEffect(() => {
  // const selectedesc = gamesapi.find(item => item.name === values.jeux);

  //       if (selectedesc) {
  //         setgameDescription(selectedesc.rules);

  //       }
  //   }, []);

  // console.log(gameDescription)
  // console.log (gameURL)
  //   const game = {
  //     name:values.jeux,
  //     photo: gameURL,
  //     description:gameDescription
  //   }
  // console.log(game)
  // console.log(JSON.stringify(game))
  /***envoi des données par axios***/
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const post = new FormData();
      post.append("title", values.title);
      post.append("jeux", values.jeux);
      post.append("nbparticipants", values.nbparticipants);
      post.append("date", values.date);
      post.append("link", values.link);
      post.append("description", values.description);
      if (image !== null) {
        post.append("photo", image.file);
      }
      post.append("youtubelink", values.youtubelink.match(/(?<=v=)[\w-]+/)[0]);
      console.log(image, 1);
      console.log(values.date, 2);
      console.log(post, 10);
      setIsLoading(true);

      CreateTour(post, token)
        .then((response) => {
          console.log("res", response);
          const tourId = response._id;
          console.log("reussit", tourId);
          navigate(`/tournaments/${tourId}`, { replace: true });
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.message === "invalid youtube link") {
            console.log("The youtube video link is unvalid");
            Swal.fire({
              title: "Invalid Youtube Link",
              icon: "error",
              showCancelButton: false,
            });
            setIsLoading(false);
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
        width: "100vw",
        minHeight: "100vh",
        backgroundColor: "#161616",
        marginTop: "10vh",
      }}
    >
      {/* style={{ minHeight: "120vh", backgroundColor: "#161616", marginTop: "12vh" }}    > */}
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
                margin: 0,
                color: "#FFFFFF",
                fontFamily: "Mulish, sans-serif",
                fontWeight: 200,
                fontSize: 60,
                marginBottom: 10,
                letterSpacing: "2px",
              }}
            >
              Create Tournament
            </h1>
          </div>
        </Grid>
      </Grid>

      {/*****************formulaire****************/}
      {/* title */}
      <FormControl required sx={{ m: 1, width: "52ch" }} variant="outlined">
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
          options={[...gamesapi.map((item) => item.name)].sort((a, b) =>
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

      {/* number participants */}
      <FormControl required sx={{ m: 1, width: "52ch" }} variant="outlined">
        <InputLabel htmlFor="name" style={{ color: "rgb(159, 156, 156)" }}>
          Number of participants
        </InputLabel>
        <OutlinedInput
          name="nbparticipants"
          onChange={handleChange}
          value={values.nbparticipants}
          id="nbparticipants"
          label="Nombre of participants"
          type="number"
          sx={{
            "& fieldset": {
              borderColor: "#FFFFFF80",
            },
          }}
          style={{ color: "#ffffff" }}
        />
        <Stack spacing={2} sx={{ width: "100%" }}>
          {formErrors.nbparticipants && (
            <Alert severity="error">{formErrors.nbparticipants}</Alert>
          )}
          {maxParticipantsError && (
            <Alert severity="error">{maxParticipantsError}</Alert>
          )}
        </Stack>
      </FormControl>

      <FormControl required sx={{ m: 1, width: "52ch" }} variant="outlined">
        <div className="date" style={{ display: "flex" }}>
          <input
            type="datetime-local"
            id="date"
            value={values.date}
            onChange={(e) => setValues({ ...values, date: e.target.value })}
          />
        </div>
        <Stack spacing={2} sx={{ width: "100%" }}>
          {formErrors.date && <Alert severity="error">{formErrors.date}</Alert>}
        </Stack>
      </FormControl>

      <FormControl required sx={{ m: 1, width: "52ch" }} variant="outlined">
        <InputLabel htmlFor="name" style={{ color: "rgb(159, 156, 156)" }}>
          Discord Link
        </InputLabel>
        <OutlinedInput
          name="link"
          onChange={handleChange}
          value={values.link}
          id="link"
          label="Link"
          sx={{
            "& fieldset": {
              borderColor: "#FFFFFF80",
            },
          }}
          style={{ color: "#ffffff" }}
        />
        <Stack spacing={2} sx={{ width: "100%" }}>
          {formErrors.link && <Alert severity="error">{formErrors.link}</Alert>}
        </Stack>
      </FormControl>

      {/* Description */}
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
      <FormControl required sx={{ m: 1, width: "52ch" }} variant="outlined">
        <InputLabel
          htmlFor="description"
          style={{ color: "rgb(159, 156, 156)" }}
        >
          Description
        </InputLabel>
        <OutlinedInput
          name="description"
          onChange={handleChange}
          value={values.description}
          id="description"
          label="Description"
          sx={{
            "& fieldset": {
              borderColor: "#FFFFFF80",
            },
          }}
          style={{ color: "#ffffff" }}
        />
        <Stack spacing={2} sx={{ width: "100%" }}>
          {formErrors.description && (
            <Alert severity="error">{formErrors.description}</Alert>
          )}
        </Stack>
      </FormControl>

      {/* image 10-04-23*/}
      {/* {picMessage && (
            <div variant="danger">{picMessage}</div>
          )}
          <FormControl controlId="pic">
            <Input
            type="file"
              onChange={(e) => postDetails(e.target.files[0])}
              id="custom-file"
              label="Upload Profile Picture"
              custom
            />
          </FormControl> */}
      {/* image */}
      {/* <div>
        {UploadImage()}
      </div> */}
      <div className="upimage">
        <ImageUploading
          multiple
          value={image}
          onChange={onChange}
          maxNumber={maxNumber}
          dataURLKey="data_url"
          acceptType={["jpg", "png"]}
        >
          {({ onImageUpload, onImageUpdate, isDragging, dragProps }) => (
            <div className="upload__image-wrapper">
              <button
                className="btnup"
                style={isDragging ? { color: "red" } : null}
                onClick={onImageUpload}
                {...dragProps}
              >
                Choose photo
              </button>
              &nbsp;
              {image && (
                <div className="image-item">
                  <img
                    src={image.data_url}
                    alt=""
                    width={width}
                    height="100px"
                  />
                  <div className="image-item__btn-wrapper">
                    <button onClick={onImageUpdate} onChange={onChange}>
                      Modify
                    </button>
                    <button onClick={() => setImage(null)}>Remove</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </ImageUploading>
      </div>

      {/* button */}
      <Button
        name="button"
        type="submit"
        onClick={handleclick}
        style={{
          backgroundColor: "#343beb",
          borderRadius: "50px",
          letterSpacing: "3px",
          width: "200px",
          marginTop: "10px",
          marginBottom: "1vh",
        }}
      >
        add Tournament
      </Button>
    </Grid>
  );
}

export default CreateTournement;
