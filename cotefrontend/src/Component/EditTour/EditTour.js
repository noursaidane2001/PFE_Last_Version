import * as React from "react";
import axios from "axios";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import "./EditTour.css";
import { useNavigate } from "react-router-dom";
import { Grid, CssBaseline, Button } from "@material-ui/core";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import ImageUploading from "react-images-uploading";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useParams } from "react-router-dom";
import withScrollToTop from "../withScrollToTop";
import dayjs from "dayjs";
import { editTour, getTour } from "../../Services/TournamentService";

function EditTour(props) {
  const { width } = props;
  const { id } = useParams();
  console.log(id);
  /**games contient les noms des games récuperer par l'api de twitch **/
  const clientId = "2b20enpdnmnhwbor0t9lwq4pkuavg3";
  const clientSecret = "magctl9dhe7m4c2f1q7nvvffhtkrch";
  const [games, setGames] = useState([]);
  const [accessToken, setAccessToken] = useState("");

  // const [Jeux, setJeux] = useState();
  const token = localStorage.getItem("token");
  console.log("token", token);
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
            setGames(response.data.data);
            console.log(games);
            console.log(response.data.data);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {});
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
  //reception de tour
  useEffect(() => {
    getTour(id, token)
      .then((response) => {
        console.log(response);
        const data = response;
        if (data.youtubelink) {
          data.youtubelink = `https://www.youtube.com/watch?v=${data.youtubelink}`;
        }
        setValues(data);
        console.log("data rendered");
      })
      .catch((error) => {
        console.log(error);
        console.log("data  not found");
      });
  }, []);
  //edit tour
  useEffect(() => {
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      const put = new FormData();
      put.append("title", values.title);
      put.append("jeux", values.jeux);
      put.append("nbparticipants", values.nbparticipants);
      put.append("date", values.date);
      put.append("link", values.link);
      put.append("description", values.description);
      if (image !== null) {
        put.append("photo", image.file);
      }
      put.append("youtubelink", values.youtubelink.match(/(?<=v=)[\w-]+/)[0]);
      console.log(image, 1);
      editTour(put, id, token)
        .then((response) => {
          console.log(response);
          console.log("reussit");
          window.location.reload();
        })
        .catch((error) => {
          console.log(error);
          if (error.message === "The youtube video link is invalid") {
            console.log("The youtube video link is unvalid");
            Swal.fire({
              title: "The youtube video link is unvalid",
              icon: "error",
              showCancelButton: false,
            });
          }
        });
    }
  }, [formErrors]);

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
      error.jeux = "Jeux is required";
    }

    if (!values.nbparticipants) {
      error.nbparticipants = "Number of max participants is required";
    } else if (!/^[1-9]\d*$/.test(values.nbparticipants)) {
      error.nbparticipants = "Please enter a positive integer";
    }
    if (!values.date) {
      error.date = "Date is required";
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

  const handleclick = (e) => {
    e.preventDefault();
    setFormErrors(validateForm(values));
    setIsSubmit(true);
  };

  // image
  const [image, setImage] = React.useState(null);
  const maxNumber = 1;
  const onChange = (imageList) => {
    // data for submit
    setImage(imageList[0]);
    console.log(imageList, 12);
  };
  //date
  const formatDate = (dateString) => {
    // Utilisez moment.js ou day.js pour analyser la date et la formater
    const formattedDate = dayjs(dateString).format("YYYY-MM-DDTHH:mm");

    // Retournez la date formatée
    return formattedDate;
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ width: "100vw" }}
    >
      <CssBaseline />

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
          Edit Tournament
        </h1>
      </div>

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
          options={["Free Fire", ...games.map((game) => game.name)].sort(
            (a, b) => a.localeCompare(b)
          )}
          sx={{ width: "52ch" }}
          renderInput={(params) => (
            <TextField {...params} label="Jeux " required />
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

      {/*date  */}
      <FormControl required sx={{ m: 1, width: "52ch" }} variant="outlined">
        <div className="date" style={{ display: "flex" }}>
          <input
            style={{ backgroundColor: "#222222" }}
            type="datetime-local"
            id="date"
            value={formatDate(values.date)}
            onChange={(e) => setValues({ ...values, date: e.target.value })}
          />
        </div>
        <Stack spacing={2} sx={{ width: "100%" }}>
          {formErrors.date && <Alert severity="error">{formErrors.date}</Alert>}
        </Stack>
      </FormControl>
      {/* Link */}
      <FormControl required sx={{ m: 1, width: "52ch" }} variant="outlined">
        <InputLabel htmlFor="name" style={{ color: "rgb(159, 156, 156)" }}>
          Link
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

      {/* youtubeLink */}
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
      {/* Description */}
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
                Edit photo
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
      <div onClick={handleclick}>
        <Button
          name="button"
          type="submit"
          style={{
            backgroundColor: "#343beb",
            borderRadius: "50px",
            letterSpacing: "3px",
            marginTop: "25vh",
            width: "210px",
            marginBottom: "5vh",
          }}
          onClick={handleclick}
        >
          Edit Tournament
        </Button>
      </div>
    </Grid>
  );
}

export default withScrollToTop(EditTour);
