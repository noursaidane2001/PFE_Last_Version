import React, { useState, useEffect } from 'react';
import withScrollToTop from '../../withScrollToTop';
import { useParams } from 'react-router-dom';
import '../Participate/ParticipateBtn.css';
import axios from 'axios';
import FlagIcon from '@mui/icons-material/Flag';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Input from '@mui/material/Input';
import Stack from '@mui/material/Stack';
import MuiAlert from '@mui/material/Alert';
import Swal from 'sweetalert2';
import { Participate, getTour, unParticipate } from '../../../Services/TournamentService';
import { CreateReclamationTour } from '../../../Services/ReclamationService';


function ParticipateBtn() {
    //alert+error
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const Alert = React.forwardRef(function Alert(props, ref) {
        return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });
    //select const
    const [type, setType] = React.useState('');
    const [body, setBody] = React.useState('');
    const handleChange = (event) => {
        setType(event.target.value);
    };
    const handleChangeBody = (e) => {
        setBody(e.target.value);

    };
    console.log(type)
    console.log(body)
    //dialog const 
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormErrors(validateForm(body, type));
        setIsSubmit(true);
        Object.keys(formErrors).length === 0 && setOpen(false);
    };
    //axios ici 
    useEffect(() => {
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            const post = {
                body: body,
                type: type,
            };
            console.log(post, "hii");
            CreateReclamationTour(id, token, post)
                .then((response) => {
                    console.log("reclamation sended", response);
                })
        }
    }, [formErrors]);
    //gestion des erreurs de formulaire 
    const validateForm = (body, type) => {
        const error = {};
        if (!body) {
            error.body = "Specification is required";
        }

        if (!type) {
            error.type = "Reclamation type is required";
        }

        return error;

    };

    //Getting user connected id 
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user._id;
    console.log(userId)
    //tour id
    const { id } = useParams();
    console.log(id)
    const [tour, setTour] = useState([]);
    const [participateDéjà, setParticipateDéjà] = useState(false);
    const [participate, setParticipate] = useState(false);
    const [cancel, setCancel] = useState(false);
    useEffect(() => {
        getTour(id)
            .then((response) => {
                setTour(response);
                setParticipateDéjà(response.participantid.some((item) => item._id.includes(userId)));
            })
            .catch((error) => {
                console.log(error);
                console.log("data not found")
            });
    }, []);
    console.log(tour)
    console.log(participateDéjà)
    // console.log(userId !== tour.idcreator?._id)
    console.log(participate)
    useEffect(() => {
        if (participate) {
            Participate(id, token)
                .then((response) => {
                    window.location.reload();
                    console.log("hii")

                })
                .catch((error) => {
                    console.error("err", error);
                    if (error.message === 'Sorry, the maximum number of participants has been reached') {
                        console.log("Sorry, the maximum number of participants has been reached");
                        Swal.fire({
                            title: "Maximum participants number reached",
                            icon: "error",
                            showCancelButton: false
                        });
                    }
                });
            setParticipate(false)
        } else if (cancel) {
            unParticipate(id, token)
                .then((response) => {
                    console.log("res", response);
                    window.location.reload();

                })
                .catch((error) => {
                    console.error("err", error);
                });
        }
    }, [participate, cancel]);

    const handleparticipateClick = (e) => {
        e.preventDefault();
        setParticipate(true);
    };
    const handleUnparticipateClick = (e) => {
        e.preventDefault();
        setCancel(true)

    };
    return (
        <div className='PartBtn'>
            {userId !== tour.idcreator?._id && participateDéjà === true && (
                <button
                    className="boutonpart"
                    style={{
                        backgroundColor: '#222',
                        borderColor: '#161616',
                        border: '0',
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 1)"

                    }}
                    onClick={handleUnparticipateClick}
                >
                    Cancel participation
                </button>
            )}
            {userId !== tour.idcreator?._id && participateDéjà === false && (
                <button
                    className="boutonpart"
                    style={{
                        backgroundColor: '#343beb',
                        borderColor: '#343beb',
                        border: '0',
                        boxShadow: "0 2px 4px rgba(0, 0, 0, 1)"
                    }}
                    onClick={handleparticipateClick}
                >
                    Participate
                </button>
            )}
            {userId !== tour.idcreator?._id && (
                <div>
                    <button className='report' onClick={handleClickOpen}>
                        <span style={{ display: 'flex', alignItems: 'center', color: '#343beb' }}>
                            <FlagIcon />
                        </span>
                    </button>
                    <Dialog
                        fullScreen={fullScreen}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title" className='Report-dialog-title'>
                            {"Report Tournament"}<IconButton
                                aria-label="close"
                                onClick={handleClose}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <DialogContentText className='textc-dialog'>
                                Help us understand what's wrong with this tournament.
                            </DialogContentText>
                            <div className='barre-gis'></div>
                            <div className='report-form'>
                                <FormControl variant="standard" className='type-select'>
                                    <InputLabel className="demo-simple-select--label">Type</InputLabel>
                                    <Select
                                        labelId="ii"
                                        id="demo-simple-select-standard"
                                        value={type}
                                        onChange={handleChange}
                                        label="Type"

                                    >
                                        <MenuItem value="rule Violations">Rule violations</MenuItem>
                                        <MenuItem value="technical Issues">Technical issues</MenuItem>
                                        <MenuItem value="streaming Quality">Streaming quality</MenuItem>
                                    </Select>
                                    <Stack  >
                                        {formErrors.type && (
                                            <Alert severity="error">{formErrors.type}</Alert>
                                        )}
                                    </Stack>
                                </FormControl>
                                <FormControl variant="standard" className='inn'>
                                    <InputLabel className='inl' htmlFor="component-simple">Please specify</InputLabel>
                                    <Input className='ins' onChange={handleChangeBody} />
                                    <Stack  >
                                        {formErrors.body && (
                                            <Alert severity="error">{formErrors.body}</Alert>
                                        )}
                                    </Stack>
                                </FormControl>

                            </div>
                        </DialogContent>
                        <DialogActions>
                            <Button className='subbtn' onClick={handleSubmit} autoFocus>
                                Submit
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )}
        </div>


    );

}
export default withScrollToTop(ParticipateBtn);
