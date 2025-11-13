import React, { useEffect } from 'react';
import '../Profile/Profile.css';
import { Grid } from '@mui/material';
import Button from '@material-ui/core/Button';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { useState } from 'react';
import withScrollToTop from '../withScrollToTop';
import Profilee from './Profilee/Profilee';
import Following from './Following/Following';
import Followers from './Followers/Followers';
import MyTour from './My Tournaments/MyTour';
import MyLivestreams from './My Livestreams/MyLivestreams';
import LiveTvIcon from '@mui/icons-material/LiveTv';

const token = localStorage.getItem("token");
console.log("token", token);
function Profile() {
    //affichage conditionnels des buttons 
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.isAdmin;

    const [clickState, setClickState] = useState('');
    console.log(clickState)
    const handleButtonClick = (button) => {
        console.log(button);
        setClickState(button);
        localStorage.setItem('clickState', clickState);
    }

    useEffect(() => {
        const storedClickState = localStorage.getItem('clickState');
        if (storedClickState) {
            setClickState(storedClickState);
        }
    }, []);
    return (
        <Grid container direction="row" justifyContent="center"
            className='profile'>
            {isAdmin ? (
                <Grid item className='barLeft0' xs={1.7} >
                    <h1 className='meee'>Me</h1>
                    <Button
                        startIcon={<PersonIcon style={{ color: '#343beb', fontSize: '2rem' }} />}
                        onClick={() => handleButtonClick('profile')}
                        className={clickState === 'profile' ? 'button active' : 'button'}
                    >
                        Profile
                    </Button>
                </Grid>
            ) : (<Grid item className='barLeft0' xs={1.7} >
                <h1 className='meee'>Me</h1>
                <Button
                    startIcon={<PersonIcon style={{ color: '#343beb', fontSize: '2rem' }} />}
                    onClick={() => handleButtonClick('profile')}
                    className={clickState === 'profile' ? 'button active' : 'button'}
                >
                    Profile
                </Button>

                <Button
                    startIcon={<FavoriteBorderIcon style={{ color: '#343beb', fontSize: '2rem' }} />}
                    onClick={() => handleButtonClick('following')}
                    className={clickState === 'following' ? 'button active' : 'button'}
                >
                    Following
                </Button>
                <Button
                    startIcon={<Diversity1Icon style={{ color: '#343beb', fontSize: '2rem' }} />}
                    onClick={() => handleButtonClick('followers')}
                    className={clickState === 'followers' ? 'button active' : 'button'}
                >
                    Followers
                </Button>
                <Button
                    startIcon={<EmojiEventsIcon style={{ color: '#343beb', fontSize: '2rem' }} />}
                    onClick={() => handleButtonClick('tournaments')}
                    className={clickState === 'tournaments' ? 'button active' : 'button'}
                >
                    My Tournaments
                </Button>
                <Button
                    startIcon={<LiveTvIcon style={{ color: '#343beb', fontSize: '1.9rem' }} />}
                    onClick={() => handleButtonClick('livestreams')}
                    className={clickState === 'livestreams' ? 'button active' : 'button'}
                >
                    My Livestreams
                </Button>
            </Grid>)}
            {isAdmin ? (
                <Grid item className='barRight0' xs={9.7}>
                    {clickState === 'profile' && <Profilee />}
                    {clickState === 'tournaments' && <MyTour />}
                    {clickState === 'livestreams' && <MyLivestreams />}
                </Grid>)
                : (
                    <Grid item className='barRight0' xs={9.7}>
                        {clickState === 'profile' && <Profilee />}
                        {clickState === 'following' && <Following />}
                        {clickState === 'followers' && <Followers />}
                        {clickState === 'tournaments' && <MyTour />}
                        {clickState === 'livestreams' && <MyLivestreams />}
                    </Grid>
                )}

        </Grid>
    );

}
export default withScrollToTop(Profile);