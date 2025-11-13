import React from 'react';
import { Grid, Card, CardContent, CardHeader, Avatar } from '@mui/material';
import './AllTournaments.css';
import { useState, useEffect } from 'react';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { bgcolor } from '@mui/system';
import Swal from 'sweetalert2';
import Box from '@mui/joy/Box';
import { border } from '@chakra-ui/react';
import { getAllLive } from '../../Services/AdminService';
import { deleteLiveA } from '../../Services/AdminService';

const token = localStorage.getItem("token");
console.log("token", token);
function deleteLive(id) {
    deleteLiveA(id, token)
        .then(response => {
            console.log(response);
                console.log('deleted succesfully')
                window.location.reload();
            
        })
        .catch(error => {
            console.log(error);
            console.log('nooo')
        });
}

function AllLive() {
    const [data, setData] = useState([]);
    useEffect(() => {
        getAllLive()
            .then((response) => {
                setData(response);
                console.log(data);
                console.log("data rendred");
            })
            .catch((error) => {
                console.log(error);
                console.log("data  not found")
            });
    }, []);

    return (
        <Grid spacing={40} className='gridprinc'>
            <Grid sx={{ height: "0vh", marginTop: "10px", width: "100vw" }} item xs={10} className='tours'>
                {data.map(item => (
                    <Card key={item._id} sx={{ marginBottom: '10px' }}>
                        <CardContent>
                            <h4>{item.title}</h4>
                            <h4>{item.jeux}</h4>
                            <div><Avatar src={`http://localhost:5000/uploads/user/${item.creatorid.photo}`} sx={{ alignItems: 'center' }} />
                            <h4>{item.creatorid.firstname}{item.creatorid.lastname}</h4>
                            </div>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Chip
                                    variant="outlined"
                                    color="danger"
                                    onClick={() => deleteLive(item._id)}
                                    endDecorator={
                                        <ChipDelete
                                            color="danger"
                                            variant="plain"
                                        >
                                            <DeleteForever />
                                        </ChipDelete>
                                    }
                                >
                                    Delete Live
                                </Chip>
                            </Box>
                        </CardContent>
                    </Card>
                ))}
            </Grid>
        </Grid>
    );
}

export default AllLive;
