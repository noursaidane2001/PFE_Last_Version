import React from 'react';
import { Grid } from '@mui/material';
import './AllTournaments.css';
import tourimage from '../img/tourimage.PNG';
// import manetteicon from '../img/manetteicon.png';
// import val from '../img/val.PNG';
// import participants from '../img/participants.png';
// import calendar from '../img/calendar.png';
import { useState, useEffect } from 'react';
import Chip from '@mui/joy/Chip';
import ChipDelete from '@mui/joy/ChipDelete';
import DeleteForever from '@mui/icons-material/DeleteForever';
import { bgcolor } from '@mui/system';
import Swal from 'sweetalert2';
import Box from '@mui/joy/Box';
import { deleteTour, getAllTour } from '../../Services/AdminService';

const token = localStorage.getItem("token");
console.log("token", token);

function deleteTournament(id) {
  Swal.fire({
    title: 'Are you sure you want to delete this tournament?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      deleteTour(id, token)
        .then(response => {
          console.log(response);
          Swal.fire({
            title: 'Tournament deleted successfully',
            icon: 'success',
            showCancelButton: false
          });
          console.log('deleted succesfully')
          window.location.reload();

        })
        .catch(error => {
          console.log(error);
          console.log('nooo')
        });
    }
  });
}
function AllTournaments() {
  const [data, setData] = useState([]);
  useEffect(() => {
    getAllTour()
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
      <Grid sx={{ height: "0vh", marginTop: "10px", width: "100vw" }} item xs={10} className='tours' >
        {data.map(item => (
          <div key={item._id} style={{ backgroundImage: `url(http://localhost:5000/uploads/tournament/${item.photo})` }}>
            <div className='title1'>{item.title}</div>
            <div className='jeux1'>
              <img alt='manette' className='manette1' />{item.jeux}
            </div>
            <div className='participants1'>
              <img alt='participants' className='particon1' />{item.nbparticipants} participants
            </div>
            <div className='date-t1'>
              <img className='calendar-t1' />
              {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
            <div >
              {/* <NavLink to={`/tournaments/${item._id}`}>
                <button type='submit' className='btn1'>Delete Tournament</button>
              </NavLink> */}
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Chip
                  variant="outlined"
                  color="danger"
                  onClick={() => deleteTournament(item._id)}
                  endDecorator={
                    <ChipDelete
                      color="danger"
                      variant="plain"
                      onClick={() => alert('You clicked the delete button!')}
                    >
                      <DeleteForever />
                    </ChipDelete>
                  }
                >
                  Delete Tournament
                </Chip>
              </Box>
            </div>
          </div>
        ))}
      </Grid>
    </Grid>
  );
}

export default AllTournaments;