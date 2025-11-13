import React, { useEffect } from 'react';
import './Admintest.css';
import { Grid } from '@mui/material';
import Button from '@material-ui/core/Button';
import { useState } from 'react';
import GestUtili from './Manageusers';
import Alltours from './AllTournaments';
import Alllive from './AllLive';
import ReclamTour from './ReclamationTournament';
import ReclamLive from './ReclamationLive';
import Divider from '@mui/material/Divider';
function Admintest(props) {
    const [clickState, setClickState] = useState("profile");
const handleButtonClick = (button) => {
    console.log(button);
    setClickState(button);
}
const [open, setOpen] = React.useState(true);
const handleClick = () => {
  setOpen(!open);}
return (
    <Grid container direction="row" justifyContent="center"
        className='back'>
        <Grid item className='barLeft' >
        {/* <h1>Admin</h1> */}
        <br></br>
        <br/><br></br>
<Divider light />
<Button
  onClick={() => handleButtonClick('Manage reclamation')}
  className={clickState === 'Manage reclamation' ? 'button active' : 'button'}
>
  Manage Tournament reclamations
</Button>
<Divider light />
<Button
  onClick={() => handleButtonClick('Manage Live reclamation')}
  className={clickState === 'Manage Live reclamation' ? 'button active' : 'button'}
>
  Manage Live reclamations
</Button>
<Divider light />
<Button
  onClick={() => handleButtonClick('All Tournaments')}
  className={clickState === 'All Tournaments' ? 'button active' : 'button'}
>
  Manage tournaments
</Button>
<Divider light />
<Button
  onClick={() => handleButtonClick('All Live')}
  className={clickState === 'All Live' ? 'button active' : 'button'}
>
  Manage Live
</Button>
<Button
  onClick={() => handleButtonClick('Manage users')}
  className={clickState === 'Manage users' ? 'button active' : 'button'}
>
  Manage users
</Button>
        </Grid>

        <Grid item className='barRight' xs={7}>
            {clickState === 'Manage reclamation' && <Grid container> <ReclamTour/></Grid>}
            {clickState === 'Manage Live reclamation' && <Grid container> <ReclamLive/></Grid>}
            {clickState === 'Manage users' && <Grid container><GestUtili/></Grid>}
            {clickState === 'All Tournaments' && <Grid container> <Alltours/></Grid>}
            {clickState === 'All Live' && <Grid container> <Alllive/></Grid>}
        </Grid>
    </Grid>
);

}
export default Admintest;