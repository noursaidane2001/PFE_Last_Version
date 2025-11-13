import React, { useState } from 'react';
import withScrollToTop from '../../../withScrollToTop';
import '../CreatedTour/CreatedTour.css';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import manetteicon from '../../../img/manetteicon.png';
import participants from '../../../img/participants.png';
import calendar from '../../../img/calendar.png';
import isLoggedin from '../../../isLoggedin/isLoggedin';
import Swal from 'sweetalert2';
import { getCreateduserTour } from '../../../../Services/TournamentService';
function CreatedTour() {
  const token = localStorage.getItem("token");
  console.log("token", token);
  const { userId } = useParams();
  const navigate = useNavigate();
  console.log(userId)
  const [tours, setTours] = useState([]);
  const isLogged = isLoggedin();

  const handleSeemore = (itemId) => {
    if (isLogged) {
      navigate(`/tournaments/${itemId}`, { replace: true });
    } else {
      Swal.fire({
        title: "Log in to eStream",
        icon: "error",
        confirmButtonText: "ok",
        showCancelButton: false
      });
      navigate(`/user/login`, { replace: true });
    }
  };
  useEffect(() => {
    getCreateduserTour(userId)
      .then((response) => {
        setTours(response);
        console.log(response);

      })
      .catch((error) => {
        console.log(error);

      });
  }, []);

  return (

    <div className='tourlist'>
      {tours.map(item => (
        <div key={item._id} className='boxToures3'>
          <img src={`http://localhost:5000/uploads/tournament/${item.photo}`} alt='tournament image' className='touraimg' />
          <div className='titleA3'>{item.title}</div>
          <div className='jeuxA3'>
            <img src={`${manetteicon}`} alt='manette' className='manetteA3' />
            {item.jeux}
          </div>
          <div className='participantsA3'>
            <img src={`${participants}`} alt='participants' className='particonA3' />
            {item.nbparticipants} participants
          </div>
          <div className='date-tA3'>
            <img src={`${calendar}`} alt='calender' className='calendar-tA3' />
            {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            <>  at  </>
            {new Date(item.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
            {item.Date}
          </div>

          <br />
          <button type='submit' className='btnseeA3' onClick={() => handleSeemore(item._id)} >See more</button>
        </div>
      ))}
    </div>
  );
}

export default withScrollToTop(CreatedTour);