import React, { useState, useEffect } from 'react';
import manetteicon from '../img/manetteicon.png';
import participants from '../img/participants.png';
import calendar from '../img/calendar.png';
import { useNavigate } from 'react-router-dom';
import '../Tournaments/filtre.css';
import isLoggedin from '../isLoggedin/isLoggedin';
import Swal from 'sweetalert2';
import { gamesapi } from '../../Data/games';
import { getAllTour } from '../../Services/TournamentService';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

function Filtre() {
  const navigate = useNavigate();
  const isLogged = isLoggedin();
  console.log("isLogged", isLogged);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;
  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState('all');
  const [selectedGame, setSelectedGame] = useState('all');

  const now = new Date(); // récupère la date et l'heure actuelles

  useEffect(() => {
    getAllTour()
      .then((response) => {
        setData(response);
        console.log("data rendred", response);
      })
      .catch((error) => {
        console.log(error);
        console.log("data  not found")
      });
  }, []);

  function handleOptionChange(event) {
    setSelectedOption(event.target.value);
  }

  function handleGameChange(event) {
    setSelectedGame(event.target.value);
  }
  function handleResetFilters() {
    // (selectedOption !== 'all' || selectedGame !== 'all')
    setSelectedOption('all');
    setSelectedGame('all');
  }

  const filteredData = data.filter(item => {
    const date = new Date(item.date);
    const isGameMatched = selectedGame === 'all' || item.jeux === selectedGame;

    if (selectedOption === 'passees') {
      return date < now && isGameMatched;
    } else if (selectedOption === 'nonPassees') {
      return date >= now && isGameMatched;
    } else {
      return isGameMatched;
    }
  });

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

  return (
    <div>
      <div>
        <div className='btn-align'>
          <select id="options" className="select-style" value={selectedOption} onChange={handleOptionChange}>
            <option value="all">All</option>
            <option value="nonPassees">Upcoming tournaments</option>
            <option value="passees">Past tournaments</option>
          </select>

          <select id="gameOptions" className="select-game" value={selectedGame} onChange={handleGameChange}>
            <option value="all">All Games</option>
            {gamesapi
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((game, index) => (
                <option key={index} value={game.name}>{game.name}</option>
              ))}
          </select>
          {(selectedOption !== 'all' || selectedGame !== 'all') && (
            <button className="btn-reset" onClick={handleResetFilters}>Clear Filters</button>
          )}
          {isLogged && isAdmin ? null : (
            <>
              {isLogged && !isAdmin ? (
                <Button className="btncreatees" onClick={() => navigate('/createtournament')}>
                  <AddIcon style={{ color: 'white' }} />
                  Create Tournament
                </Button>
              ) : null}
            </>
          )}


        </div>

        <div className='tour' >
          {filteredData.map(item => (
            <div key={item._id} className='tourbox'>
              <img src={`http://localhost:5000/uploads/tournament/${item.photo}`} alt='tournament image' className='tournoisimage' />
              <div className='title'>{item.title}</div>
              <div className='jeux'>
                <img src={`${manetteicon}`} alt='manette' className='manette' />
                {item.jeux}
              </div>
              <div className='participants'>
                <img src={`${participants}`} alt='participants' className='particon' />
                {item.nbparticipants} participants
              </div>
              <div className='date-t'>
                <img src={`${calendar}`} alt='calender' className='calendar-t' />
                {new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                <>  at  </>
                {new Date(item.date).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric' })}
                {item.Date}
              </div>
              <div className='created-at-tour'>
                <> Created at  </>
                {new Date(item.created_At).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                {item.Date}
              </div>
              <br />
              <button type='submit' className='btnsee' onClick={() => handleSeemore(item._id)} >See more</button>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
}
export default Filtre;
