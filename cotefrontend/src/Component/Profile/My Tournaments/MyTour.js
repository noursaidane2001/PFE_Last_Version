import React, { useState } from 'react';
import withScrollToTop from '../../withScrollToTop';
import '../My Tournaments/MyTour.css'
import CreatedTour from './CreatedTour/CreatedTour';
import PartTour from './PartTour/PartTour';
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import manetteicon from '../../img/manetteicon.png';
import participants from '../../img/participants.png';
import calendar from '../../img/calendar.png';
import isLoggedin from '../../isLoggedin/isLoggedin';
import Swal from 'sweetalert2';
import { getAlluserTour } from '../../../Services/TournamentService';
function MyTour() {
  const [selectedOption, setSelectedOption] = useState('all');

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };
  //all tour debut 
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
    getAlluserTour(userId)
      .then((response) => {
        setTours(response);
        console.log(response);

      })
      .catch((error) => {
        console.log(error);

      });
  }, []);
  //fin all tour
  return (
    <div>
      {selectedOption === 'all' && <div className="userProfileAlltour">
        <div className='alignFT'>
          <h1 className='Allt'>All Tournaments </h1>
          <select className='filtre-style' value={selectedOption} onChange={handleOptionChange}>
            <option value="all">All Tournaments</option>
            <option value="created">Created Tournaments</option>
            <option value="participated">Participated Tournaments</option>
          </select>
        </div>

        <div className='tourlist'>
          {tours.map(item => (
            <div key={item._id} className='boxToures1'>
              <img src={`http://localhost:5000/uploads/tournament/${item.photo}`} alt='tournament image' className='touraimg' />
              <div className='titleA1'>{item.title}</div>
              <div className='jeuxA1'>
                <img src={`${manetteicon}`} alt='manette' className='manetteA1' />
                {item.jeux}
              </div>
              <div className='participantsA1'>
                <img src={`${participants}`} alt='participants' className='particonA1' />
                {item.nbparticipants} participants
              </div>
              <div className='date-tA1'>
                <img src={`${calendar}`} alt='calender' className='calendar-tA1' />
                {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                <>  at  </>
                {new Date(item.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                {item.Date}
              </div>

              <br />
              <button type='submit' className='btnseeA1' onClick={() => handleSeemore(item._id)} >See more</button>
            </div>
          ))}

        </div>
      </div>}
      {selectedOption === 'created' &&
        <div className="userProfilecreatedtour">
          <div className='alignFTC'>
            <h1 className='createdtC'>Created Tournaments </h1>
            <select className='filtre-styleC' value={selectedOption} onChange={handleOptionChange}>
              <option value="all">All Tournaments</option>
              <option value="created">Created Tournaments</option>
              <option value="participated">Participated Tournaments</option>
            </select>
          </div>
          <CreatedTour />
        </div>}
      {selectedOption === 'participated' &&
        <div className="userProfileParttour">
          <div className='alignFTP'>
            <h1 className='Partt'>Participated Tournaments </h1>
            <select className='filtre-styleP' value={selectedOption} onChange={handleOptionChange}>
              <option value="all">All Tournaments</option>
              <option value="created">Created Tournaments</option>
              <option value="participated">Participated Tournaments</option>
            </select>
          </div>
          <PartTour />
        </div>}


    </div>
  );
}


export default withScrollToTop(MyTour);
